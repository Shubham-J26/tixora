# Tixora

A ticketing platform in the spirit of Eventbrite — event discovery, multi-tier ticket sales, QR tickets and an organizer dashboard.

Built with **Next.js 16** (App Router), **Tailwind CSS 4**, **Supabase** (Postgres + Auth + RLS) and deployed on **Vercel**.

## Features

- **Explore** — searchable, filterable event directory with category chips
- **Event pages** — cover art, schedule, venue, rich description and a sticky ticket panel
- **Checkout** — multi-tier quantity selection, buyer details, live totals, order codes
- **My tickets** — QR ticket cards per order, tied to the signed-in account
- **Create event** — publish an event with any number of ticket tiers
- **Organizer dashboard** — tickets sold, gross revenue, capacity fill per event
- **Auth** — email + password via Supabase, with a profile row created by trigger
- **RLS everywhere** — organizers own their events, buyers see only their own orders
- **Atomic checkout** — `purchase_tickets()` RPC locks inventory and creates the order

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The app runs in **demo mode** with seeded events, local checkout and browser-stored
tickets until Supabase credentials are provided. Nothing breaks — it just isn't persistent.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy **Project URL** and the **anon public key** from *Project Settings → API*.
4. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart `npm run dev`. Create an account, then publish an event from `/create`.

> Email confirmation is on by default in Supabase. For instant local sign-in you can turn it
> off under *Authentication → Providers → Email*.

## Deploy on Vercel

```bash
vercel
vercel --prod
```

Add the two environment variables in *Vercel → Project → Settings → Environment Variables*,
then redeploy.

## Data model

| Table          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `profiles`     | Public profile per auth user, created by trigger     |
| `events`       | Event details, owned by `organizer_id`               |
| `ticket_types` | Tiers with price, capacity and `quantity_sold`       |
| `orders`       | One row per purchase, with unique `code`             |
| `order_items`  | Ticket quantities and locked-in unit price           |

## Notes

- Payments are simulated. To take real money, drop Stripe Checkout in front of
  `purchase_tickets()` — the inventory logic already handles overselling.
- The demo mode fallback lives in `src/lib/events.ts` and `src/lib/supabase/config.ts`.
