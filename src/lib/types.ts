export type TicketType = {
  id: string;
  event_id?: string;
  name: string;
  description: string | null;
  price_cents: number;
  quantity_total: number;
  quantity_sold: number;
  sort_order?: number;
};

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  category: string;
  cover_url: string | null;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  starts_at: string;
  ends_at: string | null;
  status: "draft" | "published" | "cancelled" | string;
  organizer_id?: string | null;
  ticket_types: TicketType[];
};

export type OrderRecord = {
  id: string;
  code: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  total_cents: number;
  status: string;
  created_at: string;
  events?: {
    title: string;
    slug: string;
    starts_at: string;
    venue_name: string | null;
    city: string | null;
    cover_url: string | null;
    category: string;
  } | null;
  order_items?: {
    quantity: number;
    unit_price_cents: number;
    ticket_types?: { name: string } | null;
  }[];
};
