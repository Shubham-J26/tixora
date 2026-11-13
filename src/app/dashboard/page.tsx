import Link from "next/link";
import { listMyEvents } from "@/lib/events";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { mockEvents } from "@/lib/mock-events";
import { eventDate, money } from "@/lib/format";
import type { EventRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

function statsFor(event: EventRecord) {
  const sold = event.ticket_types.reduce((n, t) => n + t.quantity_sold, 0);
  const capacity = event.ticket_types.reduce((n, t) => n + t.quantity_total, 0);
  const revenue = event.ticket_types.reduce((n, t) => n + t.quantity_sold * t.price_cents, 0);
  return { sold, capacity, revenue, pct: capacity ? Math.round((sold / capacity) * 100) : 0 };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const demo = !isSupabaseConfigured;
  const events = demo
    ? mockEvents.slice(0, 5)
    : user
      ? await listMyEvents(user.id)
      : [];

  const totals = events.reduce(
    (acc, e) => {
      const s = statsFor(e);
      return {
        sold: acc.sold + s.sold,
        revenue: acc.revenue + s.revenue,
        capacity: acc.capacity + s.capacity,
      };
    },
    { sold: 0, revenue: 0, capacity: 0 },
  );

  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">
            {demo ? "Demo dashboard" : "Organizer dashboard"}
          </p>
          <h1 className="h-display mt-2 text-[34px] font-semibold text-white sm:text-[42px]">
            {user?.email ? `Hey, ${user.email.split("@")[0]}` : "Your events"}
          </h1>
        </div>
        <Link href="/create" className="btn-primary btn-sm">
          + New event
        </Link>
      </div>

      {demo && (
        <p className="mb-6 rounded-xl border border-lime/25 bg-lime/10 px-4 py-3 text-[12.5px] leading-relaxed text-lime/90">
          Showing sample events. Connect Supabase and publish your own event to see live sales here.
        </p>
      )}

      {!demo && !user ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="h-display text-xl font-semibold text-white">Sign in to open your dashboard</h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/45">
            Track sales, revenue and check-ins for every event you run.
          </p>
          <Link href="/login?next=/dashboard" className="btn-primary">
            Sign in
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Tickets sold", value: totals.sold.toLocaleString(), note: `of ${totals.capacity.toLocaleString()} capacity` },
              { label: "Gross revenue", value: money(totals.revenue), note: "before platform fee" },
              { label: "Live events", value: String(events.filter((e) => e.status === "published").length), note: `${events.length} total` },
            ].map((card) => (
              <div key={card.label} className="card p-5">
                <p className="text-[10px] tracking-[0.16em] text-white/35 uppercase">{card.label}</p>
                <p className="h-display mt-2 text-[28px] leading-none font-semibold text-white">{card.value}</p>
                <p className="mt-1.5 text-[11.5px] text-white/35">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="h-display text-[15px] font-semibold text-white">Your events</h2>
              <span className="text-[11px] text-white/35">{events.length} total</span>
            </div>

            {events.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <p className="text-[13px] text-white/45">You haven&apos;t created an event yet.</p>
                <Link href="/create" className="btn-primary btn-sm">Create your first event</Link>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {events.map((event) => {
                  const s = statsFor(event);
                  return (
                    <div key={event.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/events/${event.slug}`}
                          className="line-clamp-1 text-[14px] font-semibold text-white transition hover:text-lime"
                        >
                          {event.title}
                        </Link>
                        <p className="mt-0.5 text-[11.5px] text-white/35">
                          {eventDate(event.starts_at)} · {event.city} · {event.ticket_types.length} tiers
                        </p>
                      </div>

                      <div className="w-[110px]">
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-lime" style={{ width: `${Math.min(s.pct, 100)}%` }} />
                        </div>
                        <p className="mt-1.5 text-[10.5px] text-white/35">
                          {s.sold}/{s.capacity} sold
                        </p>
                      </div>

                      <div className="w-[90px] text-right">
                        <p className="text-[13px] font-semibold text-white">{money(s.revenue)}</p>
                        <p className="text-[10.5px] text-white/35">gross</p>
                      </div>

                      <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold text-white/50 capitalize">
                        {event.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
