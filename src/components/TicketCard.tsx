import Link from "next/link";
import { money, eventDateLong, eventTime } from "@/lib/format";

export type TicketView = {
  code: string;
  total_cents: number;
  created_at?: string;
  event: {
    title: string;
    slug: string;
    starts_at: string;
    venue_name: string | null;
    city: string | null;
    cover_url: string | null;
  };
  items: { name: string; quantity: number; unit_price_cents: number }[];
};

function Qr({ seed }: { seed: string }) {
  const hash = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7);
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" className="rounded-lg bg-white p-1" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, r) =>
        Array.from({ length: 16 }).map((_, c) => {
          const on = ((r * 17 + c * 29 + hash + ((r * c) % 7)) % 5) < 2;
          const finder =
            (r < 4 && c < 4) || (r < 4 && c > 11) || (r > 11 && c < 4)
              ? !((r === 1 && c === 1) || (r === 1 && c === 14) || (r === 14 && c === 1))
              : false;
          if (!on && !finder) return null;
          return <rect key={`${r}-${c}`} x={c * 6.5} y={r * 6.5} width="5.6" height="5.6" rx="1" fill="#07080a" />;
        }),
      )}
    </svg>
  );
}

export default function TicketCard({ ticket }: { ticket: TicketView }) {
  const qty = ticket.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-ink-2">
      <div className="flex flex-col sm:flex-row">
        <div className="relative min-h-[150px] w-full overflow-hidden bg-ink-3 sm:w-[220px]">
          {ticket.event.cover_url && (
            <img
              src={ticket.event.cover_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10 sm:bg-gradient-to-r" />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur">
            <p className="text-[10px] font-bold tracking-widest text-lime uppercase">
              {new Date(ticket.event.starts_at).toLocaleDateString("en-US", { month: "short" })}
            </p>
            <p className="text-lg leading-none font-semibold text-white">
              {new Date(ticket.event.starts_at).getDate()}
            </p>
          </div>
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={`/events/${ticket.event.slug}`}
                className="h-display line-clamp-1 text-[17px] font-semibold text-white transition hover:text-lime"
              >
                {ticket.event.title}
              </Link>
              <p className="mt-1 text-[12px] text-white/40">
                {eventDateLong(ticket.event.starts_at)} · {eventTime(ticket.event.starts_at)}
              </p>
              <p className="mt-0.5 text-[12px] text-white/40">
                {ticket.event.venue_name}
                {ticket.event.city ? ` · ${ticket.event.city}` : ""}
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <Qr seed={ticket.code} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {ticket.items.map((item) => (
              <span key={item.name} className="chip py-1 text-[11px]">
                {item.quantity}× {item.name}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-dashed border-line pt-3">
            <div>
              <p className="text-[9px] tracking-[0.16em] text-white/30 uppercase">Order code</p>
              <p className="font-mono text-[13px] font-semibold tracking-[0.18em] text-white/90">
                {ticket.code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] tracking-[0.16em] text-white/30 uppercase">{qty} ticket{qty === 1 ? "" : "s"} · paid</p>
              <p className="text-[13px] font-semibold text-lime">{money(ticket.total_cents)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
