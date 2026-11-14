import Link from "next/link";
import DemoOrders from "@/components/DemoOrders";
import TicketCard from "@/components/TicketCard";
import { listMyOrders } from "@/lib/events";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import type { OrderRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const user = await getCurrentUser();
  const orders: OrderRecord[] = user ? await listMyOrders(user.id) : [];

  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">My tickets</p>
          <h1 className="h-display mt-2 text-[34px] font-semibold text-white sm:text-[42px]">
            Everything you&apos;re going to
          </h1>
        </div>
        <Link href="/events" className="btn-ghost btn-sm">
          Find more events →
        </Link>
      </div>

      {!isSupabaseConfigured ? (
        <>
          <p className="mb-6 max-w-xl text-[13px] text-white/40">
            Demo mode — tickets bought on this device are saved in your browser.
          </p>
          <DemoOrders />
        </>
      ) : !user ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="h-display text-xl font-semibold text-white">Sign in to see your tickets</h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/45">
            Your tickets are tied to your account so they&apos;re safe if you change phones.
          </p>
          <Link href="/login?next=/tickets" className="btn-primary">
            Sign in
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="text-2xl">🎟️</span>
          <h2 className="h-display text-xl font-semibold text-white">No tickets yet</h2>
          <p className="max-w-sm text-[13px] leading-relaxed text-white/45">
            When you buy a ticket it lands here with a QR code for the door.
          </p>
          <Link href="/events" className="btn-primary">
            Browse events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <TicketCard
              key={order.id}
              ticket={{
                code: order.code,
                total_cents: order.total_cents,
                created_at: order.created_at,
                event: {
                  title: order.events?.title ?? "Event",
                  slug: order.events?.slug ?? "",
                  starts_at: order.events?.starts_at ?? new Date().toISOString(),
                  venue_name: order.events?.venue_name ?? null,
                  city: order.events?.city ?? null,
                  cover_url: order.events?.cover_url ?? null,
                  category: order.events?.category ?? "Community",
                },
                items: (order.order_items ?? []).map((i) => ({
                  name: i.ticket_types?.name ?? "Ticket",
                  quantity: i.quantity,
                  unit_price_cents: i.unit_price_cents,
                })),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
