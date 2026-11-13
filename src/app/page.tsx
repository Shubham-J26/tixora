import Link from "next/link";
import EventCard from "@/components/EventCard";
import TicketVisual from "@/components/TicketVisual";
import { listEvents } from "@/lib/events";
import { categories } from "@/lib/mock-events";

export default async function HomePage() {
  const events = await listEvents({ limit: 6 });

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.28),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute top-40 -left-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,242,77,0.16),transparent_70%)] blur-2xl" />

        <div className="wrap relative grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
          <div className="rise">
            <span className="chip border-lime/25 bg-lime/10 text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Now taking 2027 dates
            </span>

            <h1 className="h-display mt-6 text-[44px] leading-[0.98] font-semibold text-white sm:text-[62px] lg:text-[68px]">
              Your next event.
              <br />
              <span className="serif text-lime">Sold out.</span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-white/55 sm:text-base">
              Beautiful event pages, flexible ticket tiers and instant check-in — all in one
              place. Publish in minutes and keep every dollar you earn.
            </p>

            <form action="/events" className="mt-8 flex max-w-md items-center gap-2 rounded-2xl border border-line bg-ink-2 p-2 focus-within:border-white/25">
              <svg className="ml-2 shrink-0 text-white/35" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                name="q"
                placeholder="Search events, cities or venues"
                className="w-full bg-transparent py-2 text-sm text-white placeholder:text-white/35 outline-none"
              />
              <button type="submit" className="btn-primary btn-sm shrink-0">
                Search
              </button>
            </form>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12.5px] text-white/40">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" /> 2.4% + 30¢ per paid ticket
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Free events are free
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" /> No monthly fee
              </span>
            </div>
          </div>

          <div className="rise lg:justify-self-end" style={{ animationDelay: "120ms" }}>
            <TicketVisual />
          </div>
        </div>
      </section>

      {/* Category marquee */}
      <section className="border-y border-white/[0.07] bg-ink-2/50 py-4">
        <div className="flex overflow-hidden">
          <div className="marquee-track flex shrink-0 items-center gap-3 pr-3">
            {[...categories.slice(1), ...categories.slice(1), ...categories.slice(1), ...categories.slice(1)].map((c, i) => (
              <Link
                key={`${c}-${i}`}
                href={`/events?category=${encodeURIComponent(c)}`}
                className="whitespace-nowrap rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-white/55 transition hover:border-lime/40 hover:text-lime"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="wrap py-16 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">Happening soon</p>
            <h2 className="h-display mt-2 text-[30px] font-semibold text-white sm:text-[38px]">
              Trending this month
            </h2>
          </div>
          <Link href="/events" className="btn-ghost btn-sm">
            Browse all events
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="wrap scroll-mt-24 py-8 lg:py-14">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.3),transparent_70%)] blur-2xl" />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">How it works</p>
              <h2 className="h-display mt-2 text-[30px] leading-tight font-semibold text-white sm:text-[36px]">
                Live in minutes,
                <br />
                <span className="serif text-white/60">not weeks.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
                No sales calls, no setup fees, no waiting on an approval queue. Build the page,
                drop the link, watch the tickets go.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { n: "01", t: "Create", d: "Add the date, venue, cover art and ticket tiers." },
                { n: "02", t: "Share", d: "Send one link. Every share carries your branding." },
                { n: "03", t: "Scan", d: "Check guests in with any phone camera." },
              ].map((step) => (
                <div key={step.n} className="rounded-2xl border border-line bg-white/[0.02] p-5">
                  <span className="font-mono text-[11px] text-lime">{step.n}</span>
                  <h3 className="h-display mt-3 text-lg font-semibold text-white">{step.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="wrap scroll-mt-24 py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">Pricing</p>
            <h2 className="h-display mt-2 text-[30px] leading-tight font-semibold text-white sm:text-[38px]">
              One flat rate.
              <br />
              <span className="serif text-white/60">No surprises.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
              We charge a simple fee on paid tickets only. Free events cost nothing, forever.
              Payouts land two days after your event closes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create" className="btn-primary">
                Start selling
              </Link>
              <Link href="/events" className="btn-ghost">
                See an example
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Paid ticket", value: "2.4% + 30¢", note: "Per ticket, deducted at checkout" },
              { label: "Free ticket", value: "$0", note: "Unlimited registrations" },
              { label: "Payout", value: "T+2 days", note: "Straight to your bank" },
              { label: "Refunds", value: "Self-serve", note: "You stay in control" },
            ].map((row) => (
              <div key={row.label} className="card p-5">
                <p className="text-[11px] tracking-[0.14em] text-white/35 uppercase">{row.label}</p>
                <p className="h-display mt-2 text-2xl font-semibold text-white">{row.value}</p>
                <p className="mt-1 text-[12px] text-white/40">{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="wrap scroll-mt-24 pb-10">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">FAQ</p>
            <h2 className="h-display mt-2 text-[30px] font-semibold text-white">Good questions.</h2>
          </div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {[
              {
                q: "Can I sell multiple ticket types?",
                a: "Yes — add as many tiers as you like, each with its own price, description and inventory. Early bird, GA, VIP, add-ons, all on one page.",
              },
              {
                q: "How do attendees get their tickets?",
                a: "Every order generates a unique code and a QR ticket that lives in the buyer's Tixora account. They can also add it to their wallet.",
              },
              {
                q: "Do you support free events?",
                a: "Free events are unlimited and fee-free. You only pay when money changes hands.",
              },
              {
                q: "What happens when a tier sells out?",
                a: "It's marked sold out automatically and the remaining tiers stay live. You can release more inventory any time.",
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-white">
                  {item.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-white/50 transition group-open:rotate-45 group-open:border-lime group-open:text-lime">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap py-16">
        <div className="relative overflow-hidden rounded-3xl border border-lime/20 bg-[radial-gradient(circle_at_20%_0%,rgba(201,242,77,0.16),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(124,92,255,0.22),transparent_55%)] px-8 py-14 text-center sm:px-16">
          <h2 className="h-display mx-auto max-w-2xl text-[32px] leading-[1.05] font-semibold text-white sm:text-[46px]">
            Somebody is going to sell out.
            <br />
            <span className="serif text-lime">Make it you.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
            Create your first event in under five minutes. No card required.
          </p>
          <Link href="/create" className="btn-primary mt-8 px-7 py-3.5">
            Create your event
          </Link>
        </div>
      </section>
    </>
  );
}
