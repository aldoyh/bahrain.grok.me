import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Circle, Radio } from "lucide-react";
import { SHOW_EP, SHOW_NAME } from "@/lib/mixer/catalog";
import { useMixer } from "@/lib/mixer/store";
import { cn, formatTc } from "@/lib/utils";

export function TopBar({
  reverbLabel,
  peers,
}: {
  reverbLabel: string;
  peers: number;
}) {
  const recording = useMixer((s) => s.recording);
  const streaming = useMixer((s) => s.streaming);
  const recStartedAt = useMixer((s) => s.recStartedAt);
  const streamStartedAt = useMixer((s) => s.streamStartedAt);
  const showStartedAt = useMixer((s) => s.showStartedAt);
  const toggleRecord = useMixer((s) => s.toggleRecord);
  const toggleStream = useMixer((s) => s.toggleStream);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const clock = now ?? 0;

  return (
    <header className="flex shrink-0 items-center gap-1.5 border-b border-border bg-surface px-2 py-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] sm:gap-2 sm:px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-elevated shadow-[var(--shadow-border)]">
          <span className="h-3 w-3 rounded-[1px] bg-program" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="font-mono text-xs font-semibold tracking-tight">
            <span className="sm:hidden">ffmix</span>
            <span className="hidden sm:inline">ffmix-cli</span>
          </p>
          <p className="hidden truncate font-mono text-[10px] text-muted sm:block">
            {SHOW_NAME}  ·  EP {SHOW_EP}
          </p>
        </div>
      </div>

      <div className="mx-1 hidden min-w-0 shrink-0 font-mono text-[11px] tabular-nums text-fg md:mx-2 md:block">
        <span className="hidden text-muted lg:inline">
          1080p50
          <span className="text-subtle"> / </span>
        </span>
        {now == null ? "00:00:00:00" : formatTc(clock - showStartedAt)}
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => void toggleRecord()}
          aria-label={recording ? "Stop recording" : "Record"}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[11px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] sm:px-2.5",
            recording ? "bg-program text-fg" : "bg-elevated text-muted hover:text-fg",
          )}
        >
          <Circle className={cn("size-2.5", recording ? "fill-fg" : "fill-program text-program")} />
          <span className="hidden sm:inline">REC</span>
          {recording && recStartedAt && now != null ? (
            <span className="tabular-nums">{formatTc(clock - recStartedAt).slice(3, 8)}</span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={toggleStream}
          aria-label={streaming ? "Stop stream" : "Go live"}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[11px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] sm:px-2.5",
            streaming ? "bg-program text-fg" : "bg-elevated text-muted hover:text-fg",
          )}
        >
          <Radio className="size-3" />
          <span className="hidden sm:inline">{streaming ? "LIVE" : "STRM"}</span>
          {streaming && streamStartedAt && now != null ? (
            <span className="hidden tabular-nums md:inline">
              {formatTc(clock - streamStartedAt).slice(3, 8)}
            </span>
          ) : null}
        </button>
        <div className="hidden items-center gap-1.5 rounded-md bg-elevated px-2 py-1.5 font-mono text-[10px] text-muted lg:flex">
          <span className={cn("size-1.5 rounded-full", peers > 0 ? "bg-preview" : "bg-subtle")} />
          Reverb  {reverbLabel}
          {peers > 0 ? `  ·  ${peers}` : ""}
        </div>
        <nav className="flex shrink-0 rounded-md bg-elevated p-0.5">
          {[
            { to: "/", label: "Mix" },
            { to: "/tally", label: "Tal" },
            { to: "/cli", label: "CLI" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-11 items-center rounded-sm px-2.5 font-mono text-[11px] transition-colors duration-150 sm:h-8 sm:px-2.5",
                pathname === item.to ? "bg-surface text-fg" : "text-muted hover:text-fg",
              )}
            >
              <span className="sm:hidden">{item.label}</span>
              <span className="hidden sm:inline">
                {item.to === "/" ? "Mixer" : item.to === "/tally" ? "Tally" : "CLI"}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
