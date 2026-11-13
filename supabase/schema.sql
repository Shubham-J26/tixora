-- ============================================================
-- Tixora — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL -> New query)
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Profiles (one row per auth user)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are publicly readable" on public.profiles;
create policy "profiles are publicly readable" on public.profiles for select using (true);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Events
-- ------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references auth.users on delete cascade,
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  category text not null default 'Community',
  cover_url text,
  venue_name text,
  address text,
  city text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'published' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_category_idx on public.events (category);
create index if not exists events_organizer_idx on public.events (organizer_id);

alter table public.events enable row level security;

drop policy if exists "published events are public" on public.events;
create policy "published events are public" on public.events
  for select using (status = 'published' or organizer_id = auth.uid());

drop policy if exists "organizers can create events" on public.events;
create policy "organizers can create events" on public.events
  for insert with check (organizer_id = auth.uid());

drop policy if exists "organizers can update own events" on public.events;
create policy "organizers can update own events" on public.events
  for update using (organizer_id = auth.uid());

drop policy if exists "organizers can delete own events" on public.events;
create policy "organizers can delete own events" on public.events
  for delete using (organizer_id = auth.uid());

-- ------------------------------------------------------------
-- Ticket types
-- ------------------------------------------------------------
create table if not exists public.ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events on delete cascade,
  name text not null,
  description text,
  price_cents integer not null default 0 check (price_cents >= 0),
  quantity_total integer not null default 100 check (quantity_total >= 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint quantity_sold_within_total check (quantity_sold <= quantity_total)
);

create index if not exists ticket_types_event_idx on public.ticket_types (event_id);

alter table public.ticket_types enable row level security;

drop policy if exists "ticket types are public" on public.ticket_types;
create policy "ticket types are public" on public.ticket_types for select using (true);

drop policy if exists "organizers manage own ticket types" on public.ticket_types;
create policy "organizers manage own ticket types" on public.ticket_types
  for all
  using (
    exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  )
  with check (
    exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

-- ------------------------------------------------------------
-- Orders
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  event_id uuid not null references public.events on delete cascade,
  buyer_id uuid references auth.users on delete set null,
  buyer_name text not null,
  buyer_email text not null,
  total_cents integer not null default 0 check (total_cents >= 0),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'refunded', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_buyer_idx on public.orders (buyer_id);
create index if not exists orders_event_idx on public.orders (event_id);

alter table public.orders enable row level security;

drop policy if exists "buyers see own orders" on public.orders;
create policy "buyers see own orders" on public.orders
  for select using (
    buyer_id = auth.uid()
    or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid())
  );

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  ticket_type_id uuid not null references public.ticket_types on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order items follow order access" on public.order_items;
create policy "order items follow order access" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      join public.events e on e.id = o.event_id
      where o.id = order_id
        and (o.buyer_id = auth.uid() or e.organizer_id = auth.uid())
    )
  );

-- ------------------------------------------------------------
-- Checkout RPC
-- Creates the order + items and reserves inventory atomically.
-- Callable by signed-in and anonymous buyers.
-- ------------------------------------------------------------
create or replace function public.purchase_tickets(
  p_event uuid,
  p_name text,
  p_email text,
  p_items jsonb
)
returns table (order_id uuid, order_code text, total_cents integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_code text := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  v_total integer := 0;
  v_item jsonb;
  v_ticket public.ticket_types;
  v_qty integer;
  v_available integer;
  v_count integer := 0;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Select at least one ticket';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'A name is required';
  end if;

  if p_email is null or position('@' in p_email) = 0 then
    raise exception 'A valid email is required';
  end if;

  if not exists (select 1 from public.events where id = p_event) then
    raise exception 'Event not found';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := coalesce((v_item->>'quantity')::integer, 0);
    continue when v_qty <= 0;

    select * into v_ticket
    from public.ticket_types
    where id = (v_item->>'ticket_type_id')::uuid
      and event_id = p_event
    for update;

    if not found then
      raise exception 'Ticket tier not found for this event';
    end if;

    v_available := v_ticket.quantity_total - v_ticket.quantity_sold;
    if v_qty > v_available then
      raise exception 'Only % left for %', v_available, v_ticket.name;
    end if;

    v_total := v_total + v_qty * v_ticket.price_cents;
    v_count := v_count + v_qty;

    update public.ticket_types
      set quantity_sold = quantity_sold + v_qty
      where id = v_ticket.id;
  end loop;

  if v_count = 0 then
    raise exception 'Select at least one ticket';
  end if;

  insert into public.orders (id, code, event_id, buyer_id, buyer_name, buyer_email, total_cents, status)
  values (v_order_id, v_code, p_event, auth.uid(), trim(p_name), lower(trim(p_email)), v_total, 'confirmed');

  insert into public.order_items (order_id, ticket_type_id, quantity, unit_price_cents)
  select v_order_id, (i->>'ticket_type_id')::uuid, (i->>'quantity')::integer, tt.price_cents
  from jsonb_array_elements(p_items) i
  join public.ticket_types tt on tt.id = (i->>'ticket_type_id')::uuid
  where (i->>'quantity')::integer > 0;

  return query select v_order_id, v_code, v_total;
end;
$$;

revoke all on function public.purchase_tickets(uuid, text, text, jsonb) from public;
grant execute on function public.purchase_tickets(uuid, text, text, jsonb) to anon, authenticated;
