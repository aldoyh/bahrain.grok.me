import { useRef, useState } from "react";
import { Settings2 } from "lucide-react";
import { INPUTS } from "@/lib/mixer/catalog";
import { feedBadge } from "@/lib/mixer/feeds";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";
import { SourceDialog } from "./SourceDialog";

export function InputGrid() {
  const programId = useMixer((s) => s.programId);
  const previewId = useMixer((s) => s.previewId);
  const overlays = useMixer((s) => s.overlays);
  const feeds = useMixer((s) => s.feeds);
  const setPreview = useMixer((s) => s.setPreview);
  const cutTo = useMixer((s) => s.cutTo);
  const armWebcam = useMixer((s) => s.armWebcam);
  const webcamReady = useMixer((s) => s.webcamReady);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const holdRef = useRef(0);

  function armInput(id: string, kind: string, feed: boolean) {
    if (kind === "webcam" && !webcamReady && !feed) {
      void armWebcam();
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="grid shrink-0 grid-cols-2 gap-1.5 max-lg:min-h-0 max-lg:flex-1 lg:grid-cols-5">
        {INPUTS.map((input) => {
          const pgm = programId === input.id;
          const pvw = previewId === input.id;
          const onAirOverlay = pgm && overlays.some(Boolean);
          const feed = feeds[input.id];
          const badge = feedBadge(feed);
          return (
            <div
              key={input.id}
              className={cn(
                "flex min-h-14 items-stretch rounded-md transition-[box-shadow,background-color] duration-150 max-lg:h-full lg:min-h-11",
                pgm
                  ? "bg-program/15 shadow-[inset_0_0_0_1px_var(--color-program)]"
                  : pvw
                    ? "bg-preview/10 shadow-[inset_0_0_0_1px_var(--color-preview)]"
                    : "bg-elevated shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
              )}
            >
              <button
                type="button"
                onPointerDown={() => {
                  window.clearTimeout(holdRef.current);
                  holdRef.current = window.setTimeout(() => setSourceId(input.id), 480);
                }}
                onPointerUp={() => window.clearTimeout(holdRef.current)}
                onPointerLeave={() => window.clearTimeout(holdRef.current)}
                onPointerCancel={() => window.clearTimeout(holdRef.current)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSourceId(input.id);
                }}
                onClick={() => {
                  if (!armInput(input.id, input.kind, Boolean(feed))) return;
                  setPreview(input.id);
                }}
                onDoubleClick={() => {
                  if (!armInput(input.id, input.kind, Boolean(feed))) return;
                  cutTo(input.id);
                }}
                className="flex min-w-0 flex-1 select-none flex-col items-start justify-center gap-0.5 px-2.5 py-2 text-left active:scale-[0.99]"
              >
                <span className="flex w-full items-center justify-between font-mono text-[10px] text-muted">
                  <span>{input.num}</span>
                  <span className="flex items-center gap-1">
                    {feed?.kind === "audio" ? <span className="text-info">AUD</span> : null}
                    {feed?.status === "live" ? <span className="text-program">LIVE</span> : null}
                    {pvw ? <span className="text-preview">PVW</span> : null}
                    {pgm ? <span className="text-program">PGM</span> : null}
                    {onAirOverlay ? <span className="hidden text-muted lg:inline">GFX</span> : null}
                  </span>
                </span>
                <span className="w-full truncate font-sans text-sm font-medium leading-none">
                  {input.name}
                </span>
                <span className="hidden max-w-full truncate font-mono text-[10px] text-muted lg:block">
                  {badge ?? input.label}
                </span>
              </button>
              <button
                type="button"
                aria-label={`Set source for ${input.name}`}
                onClick={() => setSourceId(input.id)}
                className="hidden w-11 shrink-0 items-center justify-center text-muted hover:text-fg lg:flex"
              >
                <Settings2 className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      {sourceId ? <SourceDialog inputId={sourceId} onClose={() => setSourceId(null)} /> : null}
    </>
  );
}

export function SourceBoard() {
  const programId = useMixer((s) => s.programId);
  const previewId = useMixer((s) => s.previewId);
  const feeds = useMixer((s) => s.feeds);
  const setPreview = useMixer((s) => s.setPreview);
  const [assignId, setAssignId] = useState<string | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
      <p className="px-0.5 font-mono text-[10px] tracking-[0.16em] text-muted">
        INPUTS  ·  video  ·  audio + poster
      </p>
      {INPUTS.map((input) => {
        const feed = feeds[input.id];
        const pgm = programId === input.id;
        const pvw = previewId === input.id;
        const badge = feedBadge(feed);
        return (
          <div
            key={input.id}
            className={cn(
              "flex items-stretch gap-1 rounded-md bg-elevated",
              pgm && "shadow-[inset_0_0_0_1px_var(--color-program)]",
              pvw && !pgm && "shadow-[inset_0_0_0_1px_var(--color-preview)]",
            )}
          >
            <button
              type="button"
              onClick={() => setPreview(input.id)}
              className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
            >
              <span className="w-4 font-mono text-[11px] text-muted">{input.num}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{input.name}</span>
                <span className="block truncate font-mono text-[10px] text-muted">
                  {badge ?? input.label}
                  {feed?.kind === "audio" ? "  ·  audio" : ""}
                  {feed?.poster ? "  ·  poster" : ""}
                </span>
              </span>
              {pgm ? <span className="font-mono text-[10px] text-program">PGM</span> : null}
              {pvw ? <span className="font-mono text-[10px] text-preview">PVW</span> : null}
            </button>
            <button
              type="button"
              onClick={() => setAssignId(input.id)}
              className="h-14 w-[4.5rem] shrink-0 rounded-md bg-surface font-mono text-[11px] text-fg"
            >
              Assign
            </button>
          </div>
        );
      })}
      {assignId ? <SourceDialog inputId={assignId} onClose={() => setAssignId(null)} /> : null}
    </div>
  );
}

