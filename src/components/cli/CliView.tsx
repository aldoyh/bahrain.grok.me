import { inputById } from "@/lib/mixer/catalog";
import { useReverb } from "@/lib/mixer/reverb";
import { useMixer } from "@/lib/mixer/store";
import { feedBadge } from "@/lib/mixer/feeds";
import { MonitorStack } from "@/components/mixer/Monitors";
import { TopBar } from "@/components/mixer/TopBar";
import { TuiDock } from "@/components/mixer/TuiDock";
import { useHotkeys } from "@/components/mixer/useHotkeys";

export function CliView() {
  const reverb = useReverb("director", "CLI");
  useHotkeys();
  const programId = useMixer((s) => s.programId);
  const previewId = useMixer((s) => s.previewId);
  const transition = useMixer((s) => s.transition);
  const durationMs = useMixer((s) => s.durationMs);
  const feeds = useMixer((s) => s.feeds);
  const pgm = inputById(programId);
  const pvw = inputById(previewId);
  const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden">
      <TopBar reverbLabel={reverb.joined ? "on" : "local"} peers={peerCount} />
      <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col gap-2 p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:p-3">
        <div className="hidden gap-3 lg:grid lg:grid-cols-2">
          <div className="overflow-hidden rounded-md ring-1 ring-preview/50">
            <div className="flex items-center justify-between bg-surface px-3 py-1 font-mono text-[10px] text-preview">
              <span>PREVIEW</span>
              <span>
                {pvw?.name}
                {feedBadge(feeds[previewId]) ? `  ·  ${feedBadge(feeds[previewId])}` : ""}
              </span>
            </div>
            <div className="relative aspect-video">
              <MonitorStack which="preview" />
            </div>
          </div>
          <div className="overflow-hidden rounded-md ring-1 ring-program/70">
            <div className="flex items-center justify-between bg-surface px-3 py-1 font-mono text-[10px] text-program">
              <span>PROGRAM</span>
              <span>
                {pgm?.name}
                {feedBadge(feeds[programId]) ? `  ·  ${feedBadge(feeds[programId])}` : ""}
              </span>
            </div>
            <div className="relative aspect-video">
              <MonitorStack which="program" />
            </div>
          </div>
        </div>
        <div className="relative h-32 overflow-hidden rounded-md ring-1 ring-program/70 lg:hidden">
          <MonitorStack which="program" />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-1.5">
            <span className="rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-program">
              PGM
            </span>
            <span className="rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-fg">
              {pgm?.name ?? "—"}
            </span>
          </div>
        </div>
        <p className="truncate font-mono text-[11px] text-muted">
          php artisan ffmix  ·  {transition} {durationMs}ms  ·  PGM {pgm?.name ?? "—"}  ·  PVW {pvw?.name ?? "—"}
        </p>
        <div className="min-h-0 flex-1">
          <TuiDock expanded className="h-full" />
        </div>
      </div>
    </div>
  );
}
