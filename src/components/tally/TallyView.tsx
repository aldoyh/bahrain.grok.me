import { INPUTS, inputById } from "@/lib/mixer/catalog";
import { useReverb } from "@/lib/mixer/reverb";
import { useMixer } from "@/lib/mixer/store";
import { feedBadge } from "@/lib/mixer/feeds";
import { MonitorStack } from "@/components/mixer/Monitors";
import { TopBar } from "@/components/mixer/TopBar";
import { cn } from "@/lib/utils";

export function TallyView() {
  const reverb = useReverb("floor", "Floor");
  const programId = useMixer((s) => s.programId);
  const previewId = useMixer((s) => s.previewId);
  const streaming = useMixer((s) => s.streaming);
  const feeds = useMixer((s) => s.feeds);
  const pgm = inputById(programId);
  const pgmFeed = feeds[programId];
  const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;
  const source = feedBadge(pgmFeed);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <TopBar reverbLabel={reverb.joined ? "on" : "local"} peers={peerCount} />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.2em] text-program">FLOOR TALLY</p>
            <h1 className="truncate font-sans text-xl font-medium tracking-tight sm:text-2xl">
              {pgm ? `${pgm.name}  ·  ${source ?? pgm.label}` : "No program"}
            </h1>
          </div>
          <span
            className={cn(
              "flex h-12 items-center justify-center rounded-md px-4 font-mono text-xs sm:h-auto sm:py-1.5",
              streaming ? "bg-program text-fg" : "bg-elevated text-muted",
            )}
          >
            {streaming ? "ON AIR" : "STAND BY"}
          </span>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg ring-2 ring-program shadow-[var(--shadow-border)]">
          <MonitorStack which="program" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {INPUTS.map((input) => {
            const pgmOn = programId === input.id;
            const pvwOn = previewId === input.id;
            const badge = feedBadge(feeds[input.id]);
            return (
              <div
                key={input.id}
                className={cn(
                  "flex min-h-16 flex-col justify-center rounded-md px-3 py-2 sm:min-h-14",
                  pgmOn
                    ? "bg-program text-fg"
                    : pvwOn
                      ? "bg-preview/20 text-fg shadow-[inset_0_0_0_1px_var(--color-preview)]"
                      : "bg-elevated text-muted",
                )}
              >
                <span className="font-mono text-[10px]">{input.num}</span>
                <span className="text-sm font-medium">{input.name}</span>
                {badge ? <span className="font-mono text-[10px] opacity-80">{badge}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
