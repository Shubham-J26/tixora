import type { EventRecord, TicketType } from "./types";

type Seed = Omit<EventRecord, "id" | "ticket_types" | "status"> & {
  tickets: { name: string; description: string | null; price_cents: number; quantity_total: number; quantity_sold: number }[];
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const seeds: Seed[] = [
  {
    slug: "neon-nights-festival",
    title: "Neon Nights Festival",
    tagline: "Two stages. Twelve artists. One endless night.",
    description:
      "Neon Nights returns to the waterfront for its biggest edition yet. Twelve artists across two stages, immersive light installations, a late-night food market and a sunrise closing set. Doors open at 6pm — come early for the rooftop warm-up.",
    category: "Music",
    cover_url: img("photo-1470229722913-7ea0d8b1c0d0"),
    venue_name: "Pier 48 Waterfront",
    address: "The Embarcadero, Pier 48",
    city: "San Francisco, CA",
    starts_at: "2026-12-12T18:00:00Z",
    ends_at: "2026-12-13T04:00:00Z",
    tickets: [
      { name: "Early Bird", description: "Limited release · general admission", price_cents: 4500, quantity_total: 200, quantity_sold: 200 },
      { name: "General Admission", description: "Access to both stages", price_cents: 6500, quantity_total: 900, quantity_sold: 612 },
      { name: "Backstage Pass", description: "GA + artist lounge + welcome drink", price_cents: 16000, quantity_total: 60, quantity_sold: 41 },
    ],
  },
  {
    slug: "future-stack-summit",
    title: "Future Stack Summit",
    tagline: "The engineering conference for people who ship.",
    description:
      "A single-track day with 18 speakers building the tools you use every day. Deep dives on distributed systems, AI infrastructure, and developer experience — plus a hallway track that's worth the ticket alone. Lunch, coffee and recordings included.",
    category: "Tech",
    cover_url: img("photo-1540575467063-178a50c2df87"),
    venue_name: "The Metro Pavilion",
    address: "455 Market Street",
    city: "Austin, TX",
    starts_at: "2027-01-22T14:00:00Z",
    ends_at: "2027-01-22T23:30:00Z",
    tickets: [
      { name: "Standard", description: "Full day + lunch + recordings", price_cents: 24900, quantity_total: 400, quantity_sold: 287 },
      { name: "Team of 4", description: "Four standard passes, save 15%", price_cents: 84900, quantity_total: 40, quantity_sold: 19 },
      { name: "Workshop Add-on", description: "Hands-on lab the day before", price_cents: 12000, quantity_total: 60, quantity_sold: 38 },
    ],
  },
  {
    slug: "cellar-door-wine-tasting",
    title: "Cellar Door Wine Tasting",
    tagline: "Eight pours, one very good evening.",
    description:
      "An intimate tasting led by sommelier Mara Vidal. Eight small-production pours, paired bites from the kitchen, and a walk through the cellar. Seats are capped at 24 so everyone gets a glass-side view.",
    category: "Food & Drink",
    cover_url: img("photo-1510812431401-41d2bd2722f3"),
    venue_name: "Cellar Door",
    address: "18 Withers Lane",
    city: "Brooklyn, NY",
    starts_at: "2026-11-28T23:00:00Z",
    ends_at: "2026-11-29T02:00:00Z",
    tickets: [
      { name: "Tasting Seat", description: "Eight pours + paired bites", price_cents: 8500, quantity_total: 24, quantity_sold: 21 },
      { name: "Chef's Table", description: "Tasting seat + five-course menu", price_cents: 14500, quantity_total: 8, quantity_sold: 6 },
    ],
  },
  {
    slug: "sunrise-rooftop-yoga",
    title: "Sunrise Rooftop Yoga",
    tagline: "60 minutes of flow, 30 floors up.",
    description:
      "Start the week above the city. A 60-minute all-levels vinyasa flow on the Skyline rooftop, followed by coffee and pastries. Mats and towels provided — bring water and something warm for savasana.",
    category: "Wellness",
    cover_url: img("photo-1544367567-0f2fcb009e0b"),
    venue_name: "Skyline Rooftop",
    address: "900 5th Avenue",
    city: "Seattle, WA",
    starts_at: "2026-11-23T14:30:00Z",
    ends_at: "2026-11-23T16:00:00Z",
    tickets: [
      { name: "Drop-in", description: "Single class + coffee", price_cents: 2800, quantity_total: 40, quantity_sold: 31 },
      { name: "Five Class Pack", description: "Any five sunrise sessions", price_cents: 11500, quantity_total: 30, quantity_sold: 12 },
    ],
  },
  {
    slug: "late-show-standup",
    title: "The Late Show: Stand-Up",
    tagline: "Four comics. No filter. One bar.",
    description:
      "A tight 90-minute showcase of the city's best working comics, hosted by Dee Okafor. Two-drink minimum, seating is first-come. Doors 9pm, show 9:30 sharp.",
    category: "Comedy",
    cover_url: img("photo-1527224857830-43a7acc85260"),
    venue_name: "The Laugh Track",
    address: "77 Division Street",
    city: "Chicago, IL",
    starts_at: "2026-12-04T02:00:00Z",
    ends_at: "2026-12-04T04:00:00Z",
    tickets: [
      { name: "General Admission", description: "Unreserved seating", price_cents: 2200, quantity_total: 120, quantity_sold: 96 },
      { name: "Front Row", description: "First two rows, reserved", price_cents: 4000, quantity_total: 20, quantity_sold: 20 },
    ],
  },
  {
    slug: "analog-photo-walk",
    title: "Analog Photo Walk",
    tagline: "Shoot film through the old quarter.",
    description:
      "A guided photo walk for 35mm shooters of every level. We'll cover light, framing and street etiquette, then develop your roll together at the lab. Bring a camera or borrow one of ours (limited).",
    category: "Arts",
    cover_url: img("photo-1452780212940-6f5c0d14d848"),
    venue_name: "Halide Lab",
    address: "212 Rue Saint-Paul",
    city: "Montreal, QC",
    starts_at: "2026-12-06T15:00:00Z",
    ends_at: "2026-12-06T19:00:00Z",
    tickets: [
      { name: "Walk + Develop", description: "Guided walk, film and development", price_cents: 4800, quantity_total: 20, quantity_sold: 14 },
      { name: "Walk Only", description: "Bring your own film", price_cents: 2500, quantity_total: 15, quantity_sold: 9 },
    ],
  },
  {
    slug: "night-market-lisbon",
    title: "Night Market: Lisbon",
    tagline: "40 makers, 12 kitchens, zero rush.",
    description:
      "An open-air night market in the old fish market hall. Forty independent makers, twelve kitchens, natural wine and a DJ until midnight. Free entry, RSVP so we can plan the flow.",
    category: "Community",
    cover_url: img("photo-1531058020387-3be344556be6"),
    venue_name: "Mercado da Ribeira",
    address: "Av. 24 de Julho",
    city: "Lisbon, PT",
    starts_at: "2026-11-20T18:00:00Z",
    ends_at: "2026-11-21T00:00:00Z",
    tickets: [
      { name: "Free RSVP", description: "Skip the line at the door", price_cents: 0, quantity_total: 500, quantity_sold: 388 },
      { name: "Tasting Card", description: "Five kitchen vouchers", price_cents: 3000, quantity_total: 150, quantity_sold: 77 },
    ],
  },
  {
    slug: "harbor-half-marathon",
    title: "Harbor Half Marathon",
    tagline: "13.1 miles along the water.",
    description:
      "A fast, flat half marathon with a full harbor closure and a finish line party. Chip timing, medal, photos and a very good breakfast. Packet pickup opens two days before the race.",
    category: "Sports",
    cover_url: img("photo-1552674605-db6ffd4facb5"),
    venue_name: "Harbor Green",
    address: "1 Seaport Blvd",
    city: "Boston, MA",
    starts_at: "2027-03-14T12:00:00Z",
    ends_at: "2027-03-14T17:00:00Z",
    tickets: [
      { name: "Half Marathon", description: "Chip timed entry + medal", price_cents: 9500, quantity_total: 1200, quantity_sold: 803 },
      { name: "5K Fun Run", description: "Untimed, all ages", price_cents: 3500, quantity_total: 400, quantity_sold: 156 },
    ],
  },
];

export const mockEvents: EventRecord[] = seeds.map((seed, i) => {
  const eventId = `mock-event-${i + 1}`;
  const ticket_types: TicketType[] = seed.tickets.map((t, j) => ({
    id: `${eventId}-ticket-${j + 1}`,
    event_id: eventId,
    ...t,
  }));

  return {
    id: eventId,
    organizer_id: null,
    status: "published",
    slug: seed.slug,
    title: seed.title,
    tagline: seed.tagline,
    description: seed.description,
    category: seed.category,
    cover_url: seed.cover_url,
    venue_name: seed.venue_name,
    address: seed.address,
    city: seed.city,
    starts_at: seed.starts_at,
    ends_at: seed.ends_at,
    ticket_types,
  };
});

export const categories = [
  "All",
  "Music",
  "Tech",
  "Food & Drink",
  "Wellness",
  "Comedy",
  "Arts",
  "Sports",
  "Community",
];
