import { mockEvents } from "./mock-events";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import type { EventRecord, OrderRecord } from "./types";

export type EventQuery = {
  search?: string;
  category?: string;
  limit?: number;
};

function filterMock({ search, category, limit }: EventQuery) {
  let list = [...mockEvents];
  const q = search?.trim().toLowerCase();

  if (q) {
    list = list.filter((e) =>
      [e.title, e.tagline, e.city, e.venue_name, e.category]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }

  if (category && category !== "All") {
    list = list.filter((e) => e.category === category);
  }

  list.sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));

  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function listEvents(query: EventQuery = {}): Promise<EventRecord[]> {
  if (!isSupabaseConfigured) return filterMock(query);

  const supabase = await createClient();
  if (!supabase) return filterMock(query);

  let request = supabase
    .from("events")
    .select("*, ticket_types(*)")
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (query.category && query.category !== "All") {
    request = request.eq("category", query.category);
  }

  if (query.search?.trim()) {
    const q = query.search.trim();
    request = request.or(`title.ilike.%${q}%,city.ilike.%${q}%,venue_name.ilike.%${q}%`);
  }

  if (query.limit) request = request.limit(query.limit);

  const { data, error } = await request;

  if (error || !data?.length) {
    if (error) console.error("listEvents failed:", error.message);
    return filterMock(query);
  }

  return (data as EventRecord[]).map((e) => ({
    ...e,
    ticket_types: [...(e.ticket_types ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
  }));
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
  if (!isSupabaseConfigured) {
    return mockEvents.find((e) => e.slug === slug) ?? null;
  }

  const supabase = await createClient();
  if (!supabase) return mockEvents.find((e) => e.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("events")
    .select("*, ticket_types(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getEventBySlug failed:", error.message);
    return mockEvents.find((e) => e.slug === slug) ?? null;
  }

  const event = data as EventRecord;
  event.ticket_types = [...(event.ticket_types ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return event;
}

export async function listMyOrders(userId: string): Promise<OrderRecord[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, events(title, slug, starts_at, venue_name, city, cover_url), order_items(quantity, unit_price_cents, ticket_types(name))")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listMyOrders failed:", error.message);
    return [];
  }

  return (data ?? []) as unknown as OrderRecord[];
}

export async function listMyEvents(userId: string) {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*, ticket_types(*)")
    .eq("organizer_id", userId)
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("listMyEvents failed:", error.message);
    return [];
  }

  return (data ?? []) as EventRecord[];
}
