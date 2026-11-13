"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { money, orderCode, remaining } from "@/lib/format";
import type { EventRecord } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type Props = {
  event: EventRecord;
  demoMode: boolean;
  signedInEmail: string | null;
};

export default function TicketPicker({ event, demoMode, signedInEmail }: Props) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState(signedInEmail ?? "");
  const [step, setStep] = useState<"select" | "details" | "done">("select");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (signedInEmail) setEmail(signedInEmail);
  }, [signedInEmail]);

  const selected = useMemo(
    () =>
      event.ticket_types
        .map((t) => ({ ticket: t, quantity: qty[t.id] ?? 0 }))
        .filter((x) => x.quantity > 0),
    [qty, event.ticket_types],
  );

  const count = selected.reduce((n, x) => n + x.quantity, 0);
  const subtotal = selected.reduce((n, x) => n + x.quantity * x.ticket.price_cents, 0);
  const fee = subtotal > 0 ? Math.round(subtotal * 0.024) + 30 * count : 0;

  function setQuantity(id: string, value: number, max: number) {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(value, Math.min(max, 10))) }));
  }

  async function purchase(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !email.includes("@")) {
      setError("Add your name and a valid email so we can send the tickets.");
      return;
    }

    setBusy(true);
    const finalTotal = subtotal + fee;

    try {
      if (demoMode) {
        await new Promise((r) => setTimeout(r, 900));
        const generated = orderCode();
        const demoOrders = JSON.parse(localStorage.getItem("tixora_demo_orders") ?? "[]");
        demoOrders.push({
          code: generated,
          created_at: new Date().toISOString(),
          total_cents: finalTotal,
          event: {
            title: event.title,
            slug: event.slug,
            starts_at: event.starts_at,
            venue_name: event.venue_name,
            city: event.city,
            cover_url: event.cover_url,
          },
          items: selected.map((s) => ({
            name: s.ticket.name,
            quantity: s.quantity,
            unit_price_cents: s.ticket.price_cents,
          })),
        });
        localStorage.setItem("tixora_demo_orders", JSON.stringify(demoOrders));
        setCode(generated);
        setTotal(finalTotal);
        setStep("done");
      } else {
        const supabase = createClient();
        if (!supabase) throw new Error("Supabase is not configured.");

        const { data, error: rpcError } = await supabase.rpc("purchase_tickets", {
          p_event: event.id,
          p_name: name.trim(),
          p_email: email.trim().toLowerCase(),
          p_items: selected.map((s) => ({
            ticket_type_id: s.ticket.id,
            quantity: s.quantity,
          })),
        });

        if (rpcError) throw new Error(rpcError.message);

        const row = Array.isArray(data) ? data[0] : data;
        setCode(row?.order_code ?? "CONFIRMED");
        setTotal(finalTotal);
        setStep("done");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "done") {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lime/15 text-lime">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="h-display mt-4 text-xl font-semibold text-white">You&apos;re in.</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
          {count} ticket{count === 1 ? "" : "s"} confirmed for {event.title}.
          {demoMode ? " This is a demo order stored in your browser." : " A receipt is on its way to your inbox."}
        </p>

        <div className="mt-5 rounded-xl border border-dashed border-white/20 bg-ink-3 px-4 py-3">
          <p className="text-[10px] tracking-[0.16em] text-white/35 uppercase">Order code</p>
          <p className="mt-1 font-mono text-lg font-semibold tracking-[0.18em] text-lime">{code}</p>
        </div>

        <div className="mt-3 flex items-center justify-between text-[13px] text-white/50">
          <span>Total paid</span>
          <span className="font-semibold text-white">{money(total)}</span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/tickets" className="btn-primary">
            View my tickets
          </Link>
          <Link href="/events" className="btn-ghost">
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h3 className="h-display text-[15px] font-semibold text-white">Tickets</h3>
        <span className="chip border-none bg-white/[0.04] py-1 text-[11px]">
          {event.ticket_types.reduce((n, t) => n + remaining(t), 0)} left
        </span>
      </div>

      <div className="divide-y divide-line">
        {event.ticket_types.map((ticket) => {
          const left = remaining(ticket);
          const soldOut = left <= 0;
          const value = qty[ticket.id] ?? 0;

          return (
            <div key={ticket.id} className={`px-5 py-4 ${soldOut ? "opacity-40" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-white">{ticket.name}</p>
                  {ticket.description && (
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/40">{ticket.description}</p>
                  )}
                  <p className="mt-1.5 text-[12px] font-semibold text-lime">
                    {ticket.price_cents === 0 ? "Free" : money(ticket.price_cents)}
                  </p>
                </div>

                {soldOut ? (
                  <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/40 uppercase">
                    Sold out
                  </span>
                ) : (
                  <div className="flex shrink-0 items-center gap-1 rounded-full border border-line p-1">
                    <button
                      type="button"
                      aria-label={`Remove one ${ticket.name}`}
                      onClick={() => setQuantity(ticket.id, value - 1, left)}
                      className="grid h-6 w-6 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                      disabled={value === 0}
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-[13px] font-semibold text-white">{value}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${ticket.name}`}
                      onClick={() => setQuantity(ticket.id, value + 1, left)}
                      className="grid h-6 w-6 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {step === "select" ? (
        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-white/50">
              {count === 0 ? "No tickets selected" : `${count} ticket${count === 1 ? "" : "s"}`}
            </span>
            <span className="font-semibold text-white">{money(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={count === 0}
            onClick={() => setStep("details")}
            className="btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {count === 0 ? "Select a ticket" : "Continue"}
          </button>
          <p className="mt-3 text-center text-[11px] text-white/30">
            Instant confirmation · No account needed
          </p>
        </div>
      ) : (
        <form onSubmit={purchase} className="border-t border-line px-5 py-4">
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="buyer-name">Full name</label>
              <input
                id="buyer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="Alex Rivera"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="buyer-email">Email</label>
              <input
                id="buyer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5 border-t border-dashed border-line pt-4 text-[12.5px]">
            <div className="flex justify-between text-white/50">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Service fee</span>
              <span>{money(fee)}</span>
            </div>
            <div className="flex justify-between pt-1 text-[13.5px] font-semibold text-white">
              <span>Total</span>
              <span>{money(subtotal + fee)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary mt-4 w-full disabled:opacity-60">
            {busy ? "Reserving…" : `Get tickets · ${money(subtotal + fee)}`}
          </button>
          <button
            type="button"
            onClick={() => setStep("select")}
            className="mt-2 w-full text-center text-[12px] text-white/40 transition hover:text-white"
          >
            Back to tickets
          </button>
          {demoMode && (
            <p className="mt-3 text-center text-[11px] text-white/30">
              Demo mode — no payment is taken.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
