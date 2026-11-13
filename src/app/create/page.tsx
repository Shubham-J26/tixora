import CreateEventForm from "@/components/CreateEventForm";

export default function CreatePage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-lime uppercase">Create</p>
        <h1 className="h-display mt-2 text-[36px] leading-none font-semibold text-white sm:text-[46px]">
          Publish an event in <span className="serif text-lime">minutes</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          Add the essentials, set your tiers and go live. You can always come back and edit.
        </p>
      </div>

      <CreateEventForm />
    </div>
  );
}
