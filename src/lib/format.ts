export function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function eventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function eventDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function eventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dateBlock(iso: string) {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
  };
}

export function minPrice(priceCentsList: number[]) {
  if (!priceCentsList.length) return 0;
  return Math.min(...priceCentsList);
}

export function priceLabel(priceCentsList: number[]) {
  if (!priceCentsList.length) return "Sold out";
  const min = minPrice(priceCentsList);
  return min === 0 ? "Free" : `From ${money(min)}`;
}

export function remaining(t: { quantity_total: number; quantity_sold: number }) {
  return Math.max(0, t.quantity_total - t.quantity_sold);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function orderCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
