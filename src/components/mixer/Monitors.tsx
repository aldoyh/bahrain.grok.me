import { inputById } from "@/lib/mixer/catalog";
import { useMixer } from "@/lib/mixer/store";
import { feedBadge } from "@/lib/mixer/feeds";
import { cn } from "@/lib/utils";
import { MixCanvas } from "./MixCanvas";
import { FeedStage } from "./FeedStage";

export function MonitorStack({ which }: { which: "program" | "preview" }) {
  return (
    <>
      <FeedStage which={which} />
      <MixCanvas which={which} className="absolute inset-0" />
    </>
  );
}

function Monitor({
  which,
  className,
  pip = false,
}: {
  which: "program" | "preview";
  className?: string;
  pip?: boolean;
}) {
  const id = useMixer((s) => (which === "program" ? s.programId : s.previewId));
  const transitioning = useMixer((s) => s.transitioning);
  const feed = useMixer((s) => s.feeds[id]);
  const cutTo = useMixer((s) => s.cutTo);
  const input = inputById(id);
  const liveMix = which === "program" && Boolean(transitioning);
  const isProgram = which === "program";
  const badge = feedBadge(feed);

  return (
    <section className={cn("flex min-w-0 flex-col gap-1", className)}>
      <div className="hidden items-baseline justify-between px-0.5 lg:flex">
        <span
          className={cn(
            "font-mono text-[10px] font-semibold tracking-[0.18em]",
            isProgram ? "text-program" : "text-preview",
          )}
        >
          {isProgram ? "PROGRAM" : "PREVIEW"}
        </span>
        <span className="font-mono text-[10px] text-muted">
          {input ? `${input.num}  ${input.name}` : "—"}
          {badge ? `  ·  ${badge}` : ""}
          {feed?.status === "live" ? "  ·  LIVE" : ""}
          {liveMix ? "  ·  MIX" : ""}
        </span>
      </div>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-md bg-bg shadow-[var(--shadow-border)]",
          isProgram ? "ring-1 ring-program/70" : "ring-1 ring-preview/50",
          pip && "shadow-[0_8px_24px_rgba(0,0,0,0.55)]",
        )}
      >
        <MonitorStack which={which} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-1.5 lg:hidden">
          <span
            className={cn(
              "rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em]",
              isProgram ? "text-program" : "text-preview",
            )}
          >
            {isProgram ? "PGM" : "PVW"}
          </span>
          <span className="max-w-[70%] truncate rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-fg">
            {input ? input.name : "—"}
            {liveMix ? " MIX" : ""}
          </span>
        </div>
        {pip ? (
          <>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-1 lg:hidden">
              <span className="rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-preview">
                TAP TAKE
              </span>
            </span>
            <button
              type="button"
              aria-label="Take preview to program"
              onClick={() => cutTo()}
              className="absolute inset-0 lg:hidden"
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

export function Monitors() {
  return (
    <div className="mixer-monitors relative shrink-0 lg:grid lg:grid-cols-2 lg:gap-3">
      <Monitor
        which="preview"
        pip
        className="absolute left-1.5 top-1.5 z-10 w-[44%] min-w-28 max-w-48 lg:static lg:w-auto lg:min-w-0 lg:max-w-none"
      />
      <Monitor which="program" />
    </div>
  );
}
