import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="wrap grid min-h-[70vh] items-center gap-12 py-14 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">Welcome back</p>
        <h1 className="h-display mt-3 text-[46px] leading-[1.02] font-semibold text-white">
          Your events,
          <br />
          <span className="serif text-lime">your people.</span>
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
          Sign in to manage events, track sales and check guests in at the door.
        </p>

        <div className="mt-10 space-y-3">
          {[
            ["Live sales dashboard", "Watch tickets move in real time."],
            ["Guest lists", "Export, search and check in."],
            ["Instant payouts", "Money lands two days after your event."],
          ].map(([title, copy]) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime/15 text-[10px] text-lime">
                ✓
              </span>
              <p className="text-[13px] text-white/60">
                <span className="font-semibold text-white">{title}</span> — {copy}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
