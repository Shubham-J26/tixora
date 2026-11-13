import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="font-mono text-[11px] tracking-[0.3em] text-lime uppercase">404</span>
      <h1 className="h-display text-[40px] leading-none font-semibold text-white sm:text-[56px]">
        This one sold out
        <br />
        <span className="serif text-lime">of existence.</span>
      </h1>
      <p className="max-w-sm text-sm text-white/45">
        The page you&apos;re looking for moved, ended, or never existed.
      </p>
      <Link href="/events" className="btn-primary">
        Browse events
      </Link>
    </div>
  );
}
