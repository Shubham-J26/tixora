const palettes: Record<string, [string, string, string, string]> = {
  Music: ["#1b1035", "#7c5cff", "#ff3d81", "#c9f24d"],
  Tech: ["#061a24", "#22d3ee", "#3b82f6", "#a3e635"],
  "Food & Drink": ["#241108", "#f59e0b", "#fb7185", "#fde68a"],
  Wellness: ["#071c1a", "#2dd4bf", "#84cc16", "#a5f3fc"],
  Comedy: ["#241505", "#f97316", "#facc15", "#fda4af"],
  Arts: ["#1a0a24", "#d946ef", "#6366f1", "#f0abfc"],
  Sports: ["#06200f", "#22c55e", "#0ea5e9", "#bef264"],
  Community: ["#20100f", "#fb7185", "#8b5cf6", "#fdba74"],
};

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) % 100000;
  return h;
}

export default function CoverArt({ seed, category }: { seed: string; category: string }) {
  const [base, a, b, c] = palettes[category] ?? palettes.Community;
  const h = hash(seed);
  const id = `ca${h}`;

  const x1 = 18 + (h % 40);
  const y1 = 22 + (h % 25);
  const x2 = 62 + (h % 26);
  const y2 = 58 + (h % 30);
  const rot = h % 90;

  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={base} />
          <stop offset="100%" stopColor="#07080a" />
        </linearGradient>
        <radialGradient id={`${id}-a`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={a} stopOpacity="0.95" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-b`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={b} stopOpacity="0.9" />
          <stop offset="100%" stopColor={b} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-c`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-noise`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="400" height="260" fill={`url(#${id}-base)`} />
      <circle cx={(x1 * 400) / 100} cy={(y1 * 260) / 100} r="130" fill={`url(#${id}-a)`} />
      <circle cx={(x2 * 400) / 100} cy={(y2 * 260) / 100} r="110" fill={`url(#${id}-b)`} />
      <circle cx={(x2 * 400) / 100} cy={(y1 * 260) / 100} r="70" fill={`url(#${id}-c)`} />

      <g stroke="#ffffff" strokeOpacity="0.14" fill="none">
        <circle cx="200" cy="130" r="86" />
        <circle cx="200" cy="130" r="112" />
        <circle cx="200" cy="130" r="140" />
      </g>

      <g transform={`rotate(${rot} 200 130)`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={i}
            x="0"
            y={26 + i * 24}
            width="400"
            height="1"
            fill={`url(#${id}-line)`}
            opacity={0.1 + (i % 3) * 0.08}
          />
        ))}
      </g>

      <rect width="400" height="260" filter={`url(#${id}-noise)`} opacity="0.09" />
    </svg>
  );
}
