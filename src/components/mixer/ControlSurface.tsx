import { OVERLAYS, SCENES } from "@/lib/mixer/catalog";
import { TRANSITIONS } from "@/lib/mixer/types";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";

export function TakeBar({ className }: { className?: string }) {
  const cutTo = useMixer((s) => s.cutTo);
  const auto = useMixer((s) => s.auto);

  return (
    <div className={cn("take-bar grid grid-cols-2 gap-1.5", className)}>
      <button
        type="button"
        onClick={() => cutTo()}
        className="h-12 rounded-md bg-fg font-mono text-sm font-semibold text-bg transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        CUT
      </button>
      <button
        type="button"
        onClick={auto}
        className="h-12 rounded-md bg-elevated font-mono text-sm font-semibold text-fg shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        AUTO
      </button>
    </div>
  );
}

function DurationStepper() {
  const durationMs = useMixer((s) => s.durationMs);
  const setDuration = useMixer((s) => s.setDuration);

  return (
    <div className="flex h-12 shrink-0 items-center rounded-md bg-elevated">
      <button
        type="button"
        aria-label="Shorter transition"
        onClick={() => setDuration(Math.max(100, durationMs - 100))}
        className="flex size-12 items-center justify-center font-mono text-lg leading-none text-muted"
      >
        −
      </button>
      <span className="w-9 text-center font-mono text-[11px] tabular-nums text-fg">{durationMs}</span>
      <button
        type="button"
        aria-label="Longer transition"
        onClick={() => setDuration(Math.min(2000, durationMs + 100))}
        className="flex size-12 items-center justify-center font-mono text-lg leading-none text-muted"
      >
        +
      </button>
    </div>
  );
}

export function OverlayStrip({ className }: { className?: string }) {
  const overlays = useMixer((s) => s.overlays);
  const overlayOut = useMixer((s) => s.overlayOut);
  const toggleOverlay = useMixer((s) => s.toggleOverlay);

  return (
    <div className={cn("grid grid-cols-4 gap-1", className)}>
      {OVERLAYS.map((o) => {
        const on = overlays[o.i] && !overlayOut[o.i];
        return (
          <button
            key={o.i}
            type="button"
            onClick={() => toggleOverlay(o.i)}
            className={cn(
              "h-12 min-w-0 rounded-md px-1 font-mono text-[11px] transition-colors duration-150",
              on
                ? "bg-program/20 text-fg shadow-[inset_0_0_0_1px_var(--color-program)]"
                : overlayOut[o.i]
                  ? "bg-elevated text-warn"
                  : "bg-elevated text-muted",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ControlSurface() {
  const transition = useMixer((s) => s.transition);
  const durationMs = useMixer((s) => s.durationMs);
  const overlays = useMixer((s) => s.overlays);
  const overlayOut = useMixer((s) => s.overlayOut);
  const setTransition = useMixer((s) => s.setTransition);
  const setDuration = useMixer((s) => s.setDuration);
  const cutTo = useMixer((s) => s.cutTo);
  const auto = useMixer((s) => s.auto);
  const toggleOverlay = useMixer((s) => s.toggleOverlay);
  const applyScene = useMixer((s) => s.applyScene);
  const previewId = useMixer((s) => s.previewId);

  return (
    <>
      <div className="hidden shrink-0 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-2">
        <div className="chip-row">
          <button
            type="button"
            onClick={() => cutTo()}
            className="h-12 min-w-[4.5rem] shrink-0 rounded-md bg-fg px-4 font-mono text-xs font-semibold text-bg transition-transform duration-150 ease-out active:scale-[0.96] sm:h-11"
          >
            CUT
          </button>
          <button
            type="button"
            onClick={auto}
            className="h-12 min-w-[4.5rem] shrink-0 rounded-md bg-elevated px-4 font-mono text-xs font-semibold text-fg shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.96] sm:h-11"
          >
            AUTO
          </button>
          {TRANSITIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTransition(t.id)}
              className={cn(
                "h-12 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150 sm:h-11",
                transition === t.id ? "bg-accent text-bg" : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
          <label className="ml-1 flex h-12 shrink-0 items-center gap-2 font-mono text-[10px] text-muted sm:h-11">
            <span className="tabular-nums">{durationMs}</span>
            <span>ms</span>
            <input
              className="mix-range w-24"
              type="range"
              min={100}
              max={2000}
              step={50}
              value={durationMs}
              onChange={(e) => setDuration(Number(e.target.value))}
              aria-label="Transition duration"
              suppressHydrationWarning
            />
          </label>
        </div>

        <div className="chip-row">
          {OVERLAYS.map((o) => {
            const on = overlays[o.i] && !overlayOut[o.i];
            return (
              <button
                key={o.i}
                type="button"
                onClick={() => toggleOverlay(o.i)}
                className={cn(
                  "h-11 min-w-12 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150",
                  on
                    ? "bg-program/20 text-fg shadow-[inset_0_0_0_1px_var(--color-program)]"
                    : "bg-elevated text-muted hover:text-fg",
                )}
              >
                {o.i + 1} {o.label}
              </button>
            );
          })}
          <span className="mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" />
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => applyScene(scene.id)}
              onDoubleClick={() => applyScene(scene.id, true)}
              className={cn(
                "h-11 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150",
                previewId === scene.previewId
                  ? "bg-surface text-fg shadow-[var(--shadow-border-hover)]"
                  : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 lg:hidden">
        <div className="flex gap-1">
          {TRANSITIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTransition(t.id)}
              className={cn(
                "h-12 min-w-0 flex-1 rounded-md font-mono text-[11px] transition-colors duration-150",
                transition === t.id ? "bg-accent text-bg" : "bg-elevated text-muted",
              )}
            >
              {t.label}
            </button>
          ))}
          <DurationStepper />
        </div>
        <div className="grid grid-cols-5 gap-1">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => applyScene(scene.id)}
              className={cn(
                "h-12 min-w-0 rounded-md px-1 font-mono text-[11px] transition-colors duration-150",
                previewId === scene.previewId
                  ? "bg-surface text-fg shadow-[var(--shadow-border-hover)]"
                  : "bg-elevated text-muted",
              )}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
