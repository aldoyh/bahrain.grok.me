import { GFX_SAMPLES, OVERLAYS } from "@/lib/mixer/catalog";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";

export function GfxEditor() {
  const name = useMixer((s) => s.lowerThirdName);
  const title = useMixer((s) => s.lowerThirdTitle);
  const ticker = useMixer((s) => s.ticker);
  const scoreHome = useMixer((s) => s.scoreHome);
  const scoreAway = useMixer((s) => s.scoreAway);
  const scoreHomeN = useMixer((s) => s.scoreHomeN);
  const scoreAwayN = useMixer((s) => s.scoreAwayN);
  const overlays = useMixer((s) => s.overlays);
  const overlayOut = useMixer((s) => s.overlayOut);
  const setLowerThird = useMixer((s) => s.setLowerThird);
  const setTicker = useMixer((s) => s.setTicker);
  const setScore = useMixer((s) => s.setScore);
  const toggleOverlay = useMixer((s) => s.toggleOverlay);
  const applyGfxSample = useMixer((s) => s.applyGfxSample);

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <p className="px-0.5 font-mono text-[10px] tracking-[0.16em] text-muted">GFX SAMPLES  ·  IN / OUT</p>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
        {GFX_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => applyGfxSample(sample.id)}
            className="flex h-14 min-w-0 flex-col items-start justify-center rounded-md bg-elevated px-2 text-left active:scale-[0.98] sm:h-12"
          >
            <span className="font-mono text-[12px] text-fg">{sample.name}</span>
            <span className="hidden w-full truncate font-mono text-[10px] text-subtle sm:block">
              {sample.hint}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {OVERLAYS.map((o) => {
          const on = overlays[o.i] && !overlayOut[o.i];
          const leaving = overlayOut[o.i];
          return (
            <div key={o.i} className="flex overflow-hidden rounded-md bg-elevated">
              <div className="min-w-0 flex-1 px-2 py-1.5">
                <p className="font-mono text-[11px] text-fg">{o.label}</p>
                <p className="font-mono text-[10px] text-subtle">
                  {leaving ? "out" : on ? "hold" : "off"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleOverlay(o.i, true)}
                className={cn(
                  "h-12 w-11 shrink-0 font-mono text-[10px]",
                  on ? "bg-preview/20 text-preview" : "text-muted",
                )}
              >
                IN
              </button>
              <button
                type="button"
                onClick={() => toggleOverlay(o.i, false)}
                className={cn(
                  "h-12 w-11 shrink-0 font-mono text-[10px]",
                  leaving ? "text-warn" : "text-muted",
                )}
              >
                OUT
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">LT NAME</span>
          <input
            value={name}
            onChange={(e) => setLowerThird(e.target.value, title)}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">LT TITLE</span>
          <input
            value={title}
            onChange={(e) => setLowerThird(name, e.target.value)}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">TICKER</span>
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">HOME</span>
          <input
            value={scoreHome}
            onChange={(e) => setScore({ scoreHome: e.target.value })}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">HOME N</span>
          <input
            type="number"
            value={scoreHomeN}
            onChange={(e) => setScore({ scoreHomeN: Number(e.target.value) })}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">AWAY</span>
          <input
            value={scoreAway}
            onChange={(e) => setScore({ scoreAway: e.target.value })}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
        <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
          <span className="font-mono text-[10px] text-muted">AWAY N</span>
          <input
            type="number"
            value={scoreAwayN}
            onChange={(e) => setScore({ scoreAwayN: Number(e.target.value) })}
            className="bg-transparent text-base text-fg outline-none sm:text-sm"
            suppressHydrationWarning
          />
        </label>
      </div>
    </div>
  );
}
