import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";
import { AUDIO_BUSES } from "@/lib/mixer/catalog";
import { readMeters } from "@/lib/mixer/audio";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";
import type { AudioBusId } from "@/lib/mixer/types";

function Meter({ value, horizontal = false }: { value: number; horizontal?: boolean }) {
  const pct = Math.round(value * 100);
  if (horizontal) {
    return (
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="absolute inset-y-0 left-0 rounded-full bg-preview" style={{ width: `${pct}%` }} />
        {pct > 85 ? <div className="absolute inset-y-0 right-0 w-3 bg-program" /> : null}
      </div>
    );
  }
  return (
    <div className="relative h-28 w-1.5 overflow-hidden rounded-full bg-border">
      <div
        className="absolute inset-x-0 bottom-0 rounded-full bg-preview"
        style={{ height: `${pct}%` }}
      />
      {pct > 85 ? (
        <div className="absolute inset-x-0 top-0 h-3 bg-program" />
      ) : null}
    </div>
  );
}

export function AudioBoard() {
  const gains = useMixer((s) => s.gains);
  const mutes = useMixer((s) => s.mutes);
  const setGain = useMixer((s) => s.setGain);
  const toggleMute = useMixer((s) => s.toggleMute);
  const armAudio = useMixer((s) => s.armAudio);
  const audioArmed = useMixer((s) => s.audioArmed);
  const [mounted, setMounted] = useState(false);
  const [levels, setLevels] = useState<Record<AudioBusId, number>>({
    cam1: 0,
    cam2: 0,
    cam4: 0,
    media: 0,
    master: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!audioArmed) return;
    const id = window.setInterval(() => setLevels(readMeters()), 80);
    return () => window.clearInterval(id);
  }, [audioArmed]);

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-md bg-elevated p-2 shadow-[var(--shadow-border)] max-lg:p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted">AUDIO</p>
        {!audioArmed ? (
          <button
            type="button"
            onClick={() => void armAudio()}
            className="h-11 rounded-sm bg-surface px-3 font-mono text-[11px] text-fg lg:h-8 lg:px-2 lg:text-[10px]"
          >
            Arm
          </button>
        ) : (
          <span className="font-mono text-[10px] text-preview">LIVE</span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 lg:hidden">
        {AUDIO_BUSES.map((bus) => (
          <div key={bus.id} className="flex items-center gap-2 rounded-md bg-surface px-2 py-1.5">
            <span className="w-12 shrink-0 font-mono text-[11px] text-muted">{bus.label}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Meter value={levels[bus.id]} horizontal />
              {mounted ? (
                <Slider.Root
                  orientation="horizontal"
                  min={0}
                  max={100}
                  step={1}
                  value={[Math.round(gains[bus.id] * 100)]}
                  onValueChange={(v) => setGain(bus.id, (v[0] ?? 0) / 100)}
                  className="relative flex h-8 w-full touch-none items-center"
                  aria-label={`${bus.label} fader`}
                >
                  <Slider.Track className="relative h-1 w-full rounded-full bg-border">
                    <Slider.Range className="absolute h-full rounded-full bg-accent" />
                  </Slider.Track>
                  <Slider.Thumb className="block size-5 rounded-sm bg-fg shadow-[var(--shadow-border)] focus:outline-none" />
                </Slider.Root>
              ) : (
                <div className="h-8 w-full rounded-sm bg-border" />
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleMute(bus.id)}
              className={cn(
                "size-11 shrink-0 rounded-sm font-mono text-[11px]",
                mutes[bus.id] ? "bg-program text-fg" : "bg-elevated text-muted",
              )}
            >
              {mutes[bus.id] ? "M" : "ON"}
            </button>
          </div>
        ))}
      </div>

      <div className="hidden justify-between gap-1 overflow-x-auto lg:flex">
        {AUDIO_BUSES.map((bus) => (
          <div key={bus.id} className="flex min-w-12 flex-col items-center gap-2">
            <div className="flex items-end gap-1">
              <Meter value={levels[bus.id]} />
            {mounted ? (
              <Slider.Root
                orientation="vertical"
                min={0}
                max={100}
                step={1}
                value={[Math.round(gains[bus.id] * 100)]}
                onValueChange={(v) => setGain(bus.id, (v[0] ?? 0) / 100)}
                className="relative flex h-28 w-5 touch-none items-center justify-center"
                aria-label={`${bus.label} fader`}
              >
                <Slider.Track className="relative h-full w-1 rounded-full bg-border">
                  <Slider.Range className="absolute w-full rounded-full bg-accent" />
                </Slider.Track>
                <Slider.Thumb className="block size-3.5 rounded-sm bg-fg shadow-[var(--shadow-border)] focus:outline-none" />
              </Slider.Root>
            ) : (
              <div className="h-28 w-5 rounded-sm bg-border" />
            )}
            </div>
            <button
              type="button"
              onClick={() => toggleMute(bus.id)}
              className={cn(
                "h-8 min-w-10 rounded-sm px-1 font-mono text-[10px]",
                mutes[bus.id] ? "bg-program text-fg" : "bg-surface text-muted",
              )}
            >
              {mutes[bus.id] ? "M" : bus.label}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
