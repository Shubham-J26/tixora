"use client";

import { useEffect, useState } from "react";
import TicketCard, { type TicketView } from "./TicketCard";

export default function DemoOrders() {
  const [tickets, setTickets] = useState<TicketView[] | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("tixora_demo_orders") ?? "[]");
      setTickets(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTickets([]);
    }
  }, []);

  if (tickets === null) return null;

  if (!tickets.length) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="text-2xl">🎟️</span>
        <h3 className="h-display text-lg font-semibold text-white">No tickets yet</h3>
        <p className="max-w-xs text-[13px] leading-relaxed text-white/45">
          Grab a ticket on any event page and it will show up here — stored locally in this demo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...tickets].reverse().map((t) => (
        <TicketCard key={t.code} ticket={t} />
      ))}
    </div>
  );
}
