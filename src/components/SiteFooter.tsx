import Link from "next/link";
import { Logo } from "./SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.07] bg-ink-2/60">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-white/45">
            Ticketing that gets out of the way. Sell out your next event with clean pages,
            instant payouts and check-in that actually works.
          </p>
        </div>

        <FooterCol
          title="Product"
          items={[
            { label: "Explore events", href: "/events" },
            { label: "Create an event", href: "/create" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Dashboard", href: "/dashboard" },
          ]}
        />
        <FooterCol
          title="Organizers"
          items={[
            { label: "How it works", href: "/#how" },
            { label: "Payouts", href: "/#pricing" },
            { label: "Check-in app", href: "/#how" },
            { label: "Help centre", href: "/#faq" },
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            { label: "About", href: "/" },
            { label: "Careers", href: "/" },
            { label: "Privacy", href: "/" },
            { label: "Terms", href: "/" },
          ]}
        />
      </div>

      <div className="wrap flex flex-col gap-3 border-t border-white/[0.06] py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Tixora. Built with Next.js &amp; Supabase.</span>
        <span>Demo project — payments are simulated.</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="text-sm text-white/65 transition hover:text-lime">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
