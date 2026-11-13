export default function TicketVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.35),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(201,242,77,0.22),transparent_55%)] blur-2xl" />

      {/* back ticket */}
      <div className="absolute inset-x-6 top-6 h-full rotate-[7deg] rounded-3xl border border-white/10 bg-white/[0.03]" />

      <div className="float-slow relative rotate-[-3deg] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#191c24] to-[#0c0e13] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between border-b border-dashed border-white/15 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-lime text-[10px] font-black text-ink">T</span>
            <span className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Admit one</span>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">GA</span>
        </div>

        <div className="px-5 pt-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-lime uppercase">Dec 12 · 6:00 PM</p>
          <h3 className="h-display mt-2 text-[26px] leading-[1.1] font-semibold text-white">
            Neon Nights
            <br />
            Festival
          </h3>
          <p className="mt-2 text-[12px] text-white/45">Pier 48 Waterfront · San Francisco</p>
        </div>

        <div className="mt-5 flex items-end justify-between px-5">
          <div className="space-y-3">
            <div>
              <p className="text-[9px] tracking-[0.16em] text-white/35 uppercase">Ticket holder</p>
              <p className="text-[13px] font-medium text-white/85">Alex Rivera</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.16em] text-white/35 uppercase">Order</p>
              <p className="font-mono text-[13px] text-white/85">NN-4F92-K3</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-2">
            <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
              <rect width="76" height="76" fill="#fff" />
              {Array.from({ length: 12 }).map((_, r) =>
                Array.from({ length: 12 }).map((_, c) => {
                  const on = (r * 7 + c * 5 + ((r * c) % 3)) % 4 < 2;
                  const corner = (r < 3 && c < 3) || (r < 3 && c > 8) || (r > 8 && c < 3);
                  if (!on && !corner) return null;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={4 + c * 5.6}
                      y={4 + r * 5.6}
                      width="4.6"
                      height="4.6"
                      fill="#07080a"
                      rx="0.8"
                    />
                  );
                }),
              )}
            </svg>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-dashed border-white/15 px-5 py-4">
          <span className="text-[10px] tracking-[0.16em] text-white/35 uppercase">Scan at the door</span>
          <span className="text-[10px] font-semibold text-lime">tixora.app</span>
        </div>

        <div className="absolute top-[108px] -left-3 h-6 w-6 rounded-full bg-ink" />
        <div className="absolute top-[108px] -right-3 h-6 w-6 rounded-full bg-ink" />
      </div>
    </div>
  );
}
