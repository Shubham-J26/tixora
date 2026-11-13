import Link from "next/link";
import EventCard from "@/components/EventCard";
import { listEvents } from "@/lib/events";
import { categories } from "@/lib/mock-events";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "All" } = await searchParams;
  const events = await listEvents({ search: q, category });

  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">Explore</p>
        <h1 className="h-display mt-2 text-[36px] leading-none font-semibold text-white sm:text-[48px]">
          Find your next <span className="serif text-lime">great night</span>
        </h1>
        <p className="mt-4 text-sm text-white/50">
          {events.length} event{events.length === 1 ? "" : "s"}
          {category !== "All" ? ` in ${category}` : ""}
          {q ? ` matching “${q}”` : ""}.
        </p>
      </div>

      <form action="/events" className="mb-6 flex max-w-2xl gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-ink-2 px-3 focus-within:border-white/25">
          <svg className="shrink-0 text-white/35" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search events, cities, venues…"
            className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 outline-none"
          />
          {category !== "All" && <input type="hidden" name="category" value={category} />}
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => {
          const active = c === category;
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (c !== "All") params.set("category", c);
          const href = params.toString() ? `/events?${params}` : "/events";

          return (
            <Link
              key={c}
              href={href}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                active
                  ? "border-lime bg-lime text-ink"
                  : "border-line bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              {c}
            </Link>
          );
        })}
      </div>

      {events.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-20 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-white/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h2 className="h-display text-xl font-semibold text-white">Nothing here yet</h2>
            <p className="mt-1.5 text-sm text-white/45">
              Try a different category or search term.
            </p>
          </div>
          <Link href="/events" className="btn-ghost btn-sm">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
