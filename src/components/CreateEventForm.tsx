"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/format";

type Tier = { key: string; name: string; description: string; price: string; quantity: string };

const newTier = (name = "General Admission", price = "45", quantity = "100"): Tier => ({
  key: Math.random().toString(36).slice(2),
  name,
  description: "",
  price,
  quantity,
});

export default function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Music");
  const [coverUrl, setCoverUrl] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [tiers, setTiers] = useState<Tier[]>([newTier()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function updateTier(key: string, patch: Partial<Tier>) {
    setTiers((prev) => prev.map((t) => (t.key === key ? { ...t, ...patch } : t)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(
        "Supabase isn't connected yet. Once NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set, events will save to your database — the form itself is ready to go.",
      );
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login?next=/create");
      return;
    }

    setBusy(true);
    try {
      const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;

      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          organizer_id: userData.user.id,
          slug,
          title: title.trim(),
          tagline: tagline.trim() || null,
          description: description.trim() || null,
          category,
          cover_url: coverUrl.trim() || null,
          venue_name: venue.trim() || null,
          address: address.trim() || null,
          city: city.trim() || null,
          starts_at: new Date(startsAt).toISOString(),
          ends_at: endsAt ? new Date(endsAt).toISOString() : null,
          status: "published",
        })
        .select("id, slug")
        .single();

      if (eventError) throw eventError;

      const rows = tiers.map((t, i) => ({
        event_id: event.id,
        name: t.name.trim() || `Tier ${i + 1}`,
        description: t.description.trim() || null,
        price_cents: Math.max(0, Math.round(Number(t.price || 0) * 100)),
        quantity_total: Math.max(1, Math.round(Number(t.quantity || 1))),
        sort_order: i,
      }));

      const { error: tiersError } = await supabase.from("ticket_types").insert(rows);
      if (tiersError) throw tiersError;

      setDone(true);
      router.push(`/events/${event.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish your event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
      <div className="space-y-6">
        <section className="card space-y-4 p-6">
          <h2 className="h-display text-lg font-semibold text-white">The basics</h2>

          <div>
            <label className="label" htmlFor="title">Event name *</label>
            <input
              id="title"
              required
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Neon Nights Festival"
            />
          </div>

          <div>
            <label className="label" htmlFor="tagline">One-line tagline</label>
            <input
              id="tagline"
              className="field"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Two stages. Twelve artists. One endless night."
            />
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={5}
              className="field resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should guests know before they arrive?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="category">Category</label>
              <select
                id="category"
                className="field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["Music", "Tech", "Food & Drink", "Wellness", "Comedy", "Arts", "Sports", "Community"].map(
                  (c) => (
                    <option key={c} value={c}>{c}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="cover">Cover image URL</label>
              <input
                id="cover"
                className="field"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/…"
              />
            </div>
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="h-display text-lg font-semibold text-white">When &amp; where</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="starts">Starts *</label>
              <input
                id="starts"
                type="datetime-local"
                required
                className="field"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="ends">Ends</label>
              <input
                id="ends"
                type="datetime-local"
                className="field"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="venue">Venue</label>
              <input
                id="venue"
                className="field"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Pier 48 Waterfront"
              />
            </div>
            <div>
              <label className="label" htmlFor="city">City</label>
              <input
                id="city"
                className="field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="address">Address</label>
            <input
              id="address"
              className="field"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="The Embarcadero, Pier 48"
            />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="h-display text-lg font-semibold text-white">Ticket tiers</h2>
            <button
              type="button"
              onClick={() => setTiers((prev) => [...prev, newTier("VIP", "120", "25")])}
              className="btn-ghost btn-sm"
            >
              + Add tier
            </button>
          </div>

          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <div key={tier.key} className="rounded-xl border border-line bg-ink-3/60 p-4">
                <div className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
                  <input
                    className="field"
                    value={tier.name}
                    onChange={(e) => updateTier(tier.key, { name: e.target.value })}
                    placeholder={`Tier ${i + 1} name`}
                  />
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-white/35">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="field pl-7"
                      value={tier.price}
                      onChange={(e) => updateTier(tier.key, { price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <input
                    type="number"
                    min="1"
                    className="field"
                    value={tier.quantity}
                    onChange={(e) => updateTier(tier.key, { quantity: e.target.value })}
                    placeholder="Quantity"
                  />
                </div>
                <div className="mt-3 flex gap-3">
                  <input
                    className="field"
                    value={tier.description}
                    onChange={(e) => updateTier(tier.key, { description: e.target.value })}
                    placeholder="Short description (optional)"
                  />
                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTiers((prev) => prev.filter((t) => t.key !== tier.key))}
                      className="shrink-0 rounded-xl border border-line px-3 text-xs text-white/40 transition hover:border-red-500/40 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <p className="text-[10px] tracking-[0.18em] text-white/35 uppercase">Preview</p>
          <h3 className="h-display mt-2 line-clamp-2 text-xl leading-tight font-semibold text-white">
            {title || "Your event name"}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] text-white/45">
            {tagline || "Your one-line tagline goes here."}
          </p>

          <div className="mt-5 space-y-2 border-t border-line pt-4 text-[12.5px]">
            <div className="flex justify-between text-white/45">
              <span>Date</span>
              <span className="text-white/80">
                {startsAt ? new Date(startsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </span>
            </div>
            <div className="flex justify-between text-white/45">
              <span>City</span>
              <span className="text-white/80">{city || "—"}</span>
            </div>
            <div className="flex justify-between text-white/45">
              <span>Tiers</span>
              <span className="text-white/80">{tiers.length}</span>
            </div>
            <div className="flex justify-between text-white/45">
              <span>Capacity</span>
              <span className="text-white/80">
                {tiers.reduce((n, t) => n + Number(t.quantity || 0), 0)}
              </span>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <p className="mt-5 rounded-lg border border-lime/25 bg-lime/10 px-3 py-2.5 text-[11.5px] leading-relaxed text-lime/90">
              Demo mode — publishing is disabled until Supabase is connected.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11.5px] leading-relaxed text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || done} className="btn-primary mt-5 w-full disabled:opacity-60">
            {busy ? "Publishing…" : done ? "Published ✓" : "Publish event"}
          </button>
          <p className="mt-3 text-center text-[11px] text-white/30">You can edit or unpublish anytime.</p>
        </div>
      </div>
    </form>
  );
}
