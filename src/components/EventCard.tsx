import Link from "next/link";
import EventCover from "./EventCover";
import { dateBlock, priceLabel } from "@/lib/format";
import type { EventRecord } from "@/lib/types";

export default function EventCard({ event, priority = false }: { event: EventRecord; priority?: boolean }) {
  const prices = event.ticket_types.map((t) => t.price_cents);
  const soldOut = event.ticket_types.every((t) => t.quantity_sold >= t.quantity_total);
  const { month, day } = dateBlock(event.starts_at);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-3">
        <EventCover
          src={event.cover_url}
          seed={event.slug}
          category={event.category}
          className="absolute inset-0"
          imgClassName="transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl border border-white/15 bg-black/55 px-2.5 py-1.5 backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-widest text-lime">{month}</span>
          <span className="text-base leading-tight font-semibold text-white">{day}</span>
        </div>

        {soldOut && (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink">
            Sold out
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="h-display line-clamp-2 text-[17px] leading-snug font-semibold text-white group-hover:text-lime">
          {event.title}
        </h3>
        <p className="line-clamp-1 text-[13px] text-white/45">
          {event.venue_name} · {event.city}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-[13px] font-semibold text-lime">{priceLabel(prices)}</span>
          <span className="text-[11px] text-white/35">
            {new Date(event.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </Link>
  );
}
