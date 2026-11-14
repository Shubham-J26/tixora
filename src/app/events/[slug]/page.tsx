import Link from "next/link";
import { notFound } from "next/navigation";
import EventCover from "@/components/EventCover";
import TicketPicker from "@/components/TicketPicker";
import EventCard from "@/components/EventCard";
import { getEventBySlug, listEvents } from "@/lib/events";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { eventDateLong, eventTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found — Tixora" };
  return {
    title: `${event.title} — Tixora`,
    description: event.tagline ?? event.description?.slice(0, 150),
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const user = await getCurrentUser();
  const others = (await listEvents({ category: event.category, limit: 4 })).filter(
    (e) => e.id !== event.id,
  );

  return (
    <div className="pb-10">
      {/* Cover */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]">
        <EventCover
          src={event.cover_url}
          seed={event.slug}
          category={event.category}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      </div>

      <div className="wrap relative -mt-28 lg:-mt-36">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <Link
              href="/events"
              className="mb-5 inline-flex items-center gap-1.5 text-[12px] text-white/45 transition hover:text-white"
            >
              ← All events
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-lime/25 bg-lime/10 text-lime">{event.category}</span>
              <span className="chip">{event.ticket_types.length} ticket types</span>
            </div>

            <h1 className="h-display mt-4 text-[38px] leading-[1.02] font-semibold text-white sm:text-[54px]">
              {event.title}
            </h1>

            {event.tagline && (
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">{event.tagline}</p>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-line bg-ink-2/70 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{eventDateLong(event.starts_at)}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">
                    {eventTime(event.starts_at)}
                    {event.ends_at ? ` – ${eventTime(event.ends_at)}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-line bg-ink-2/70 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet/15 text-violet">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{event.venue_name}</p>
                  <p className="mt-0.5 text-[12px] text-white/40">
                    {event.address ? `${event.address} · ` : ""}
                    {event.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/[0.08] pt-8">
              <h2 className="h-display text-xl font-semibold text-white">About this event</h2>
              <p className="mt-3 max-w-2xl text-[14.5px] leading-[1.75] whitespace-pre-line text-white/55">
                {event.description ?? "More details coming soon."}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Mobile tickets", d: "Scan straight from your phone." },
                { t: "Instant confirmation", d: "Tickets land in your account." },
                { t: "Easy transfers", d: "Send a ticket to a friend." },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-line bg-white/[0.02] p-4">
                  <p className="text-[13px] font-semibold text-white">{f.t}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-white/40">{f.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-ink-2 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet to-[#3d2f8c] text-sm font-bold text-white">
                {event.title.slice(0, 1)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.16em] text-white/35 uppercase">Presented by</p>
                <p className="text-[13.5px] font-semibold text-white">Tixora Events</p>
              </div>
              <button className="btn-ghost btn-sm" type="button">
                Follow
              </button>
            </div>
          </div>

          {/* Sticky ticket panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <TicketPicker
              event={event}
              demoMode={!isSupabaseConfigured}
              signedInEmail={user?.email ?? null}
            />
            <ul className="mt-4 space-y-2 px-1 text-[11.5px] text-white/35">
              <li className="flex items-center gap-2">
                <span className="text-lime">✓</span> Full refund up to 7 days before
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime">✓</span> Tickets are transferable
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lime">✓</span> 18+ unless accompanied
              </li>
            </ul>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-20 border-t border-white/[0.08] pt-10">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="h-display text-2xl font-semibold text-white">
                More {event.category.toLowerCase()} events
              </h2>
              <Link href="/events" className="text-[13px] text-white/50 transition hover:text-lime">
                See all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
