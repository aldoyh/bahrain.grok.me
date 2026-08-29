import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { inputById } from "@/lib/mixer/catalog";
import {
  SAMPLE_AUDIO,
  SAMPLE_HLS,
  SAMPLE_POSTER,
  SAMPLE_YOUTUBE,
  SAMPLE_YOUTUBE_LIVE,
  parseFeedUrl,
  withPlayback,
  type FeedKind,
} from "@/lib/mixer/feeds";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";

type Mode = "auto" | "youtube" | "hls" | "rtmp" | "audio";

const MODES: { id: Mode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "youtube", label: "YouTube" },
  { id: "hls", label: "HLS" },
  { id: "rtmp", label: "RTMP" },
  { id: "audio", label: "Audio" },
];

const SAMPLES: { label: string; url: string; mode: Mode; poster?: string }[] = [
  { label: "YouTube · BBB", url: SAMPLE_YOUTUBE, mode: "youtube" },
  { label: "YouTube Live", url: SAMPLE_YOUTUBE_LIVE, mode: "youtube" },
  { label: "HLS · Mux", url: SAMPLE_HLS, mode: "hls" },
  { label: "Audio bed", url: SAMPLE_AUDIO, mode: "audio", poster: SAMPLE_POSTER },
];

function forceFor(mode: Mode): FeedKind | "auto" {
  if (mode === "auto") return "auto";
  return mode;
}

async function posterFromFile(file: File): Promise<string> {
  const blobUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Image failed"));
      el.src = blobUrl;
    });
    const canvas = document.createElement("canvas");
    const max = 960;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    canvas.width = Math.max(2, Math.round(image.width * scale));
    canvas.height = Math.max(2, Math.round(image.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return blobUrl;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export function SourceDialog({ inputId, onClose }: { inputId: string; onClose: () => void }) {
  const input = inputById(inputId);
  const feed = useMixer((s) => s.feeds[inputId]);
  const setFeed = useMixer((s) => s.setFeed);
  const clearFeed = useMixer((s) => s.clearFeed);

  const [mode, setMode] = useState<Mode>(() => {
    if (feed?.kind === "youtube") return "youtube";
    if (feed?.kind === "rtmp") return "rtmp";
    if (feed?.kind === "audio" || feed?.audioOnly) return "audio";
    if (feed?.kind === "hls" || feed?.kind === "flv") return "hls";
    return "auto";
  });
  const [url, setUrl] = useState(feed?.url ?? "");
  const [playback, setPlayback] = useState(feed?.playbackUrl ?? "");
  const [poster, setPoster] = useState(feed?.poster ?? "");
  const [error, setError] = useState<string | null>(null);

  const showPlayback = mode === "rtmp" || /^rtmps?:\/\//i.test(url.trim());
  const showPoster = mode === "audio" || mode === "auto";

  const preview = useMemo(() => {
    const parsed = parseFeedUrl(url, forceFor(mode), poster);
    if (!("kind" in parsed)) return parsed;
    return withPlayback(parsed, showPlayback ? playback : undefined, poster);
  }, [url, mode, playback, poster, showPlayback]);

  function apply() {
    const parsed = parseFeedUrl(url, forceFor(mode), poster);
    if (!("kind" in parsed)) {
      setError(parsed.error);
      return;
    }
    const next = withPlayback(parsed, showPlayback ? playback : undefined, poster);
    setFeed(inputId, next);
    onClose();
  }

  if (!input) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/80" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-lg bg-surface shadow-[var(--shadow-border)] outline-none sm:inset-x-auto sm:bottom-auto sm:top-[6%] sm:left-1/2 sm:w-[32rem] sm:-translate-x-1/2 sm:rounded-lg">
          <div className="flex justify-center pt-2 sm:hidden">
            <span className="sheet-handle" />
          </div>
          <div className="flex items-baseline justify-between border-b border-border px-4 py-3">
            <div>
              <Dialog.Title className="font-sans text-base font-medium">
                Input source
              </Dialog.Title>
              <Dialog.Description className="font-mono text-[11px] text-muted">
                {input.num}  {input.name}  ·  {input.label}
              </Dialog.Description>
            </div>
            <Dialog.Close className="flex size-11 items-center justify-center font-mono text-[11px] text-muted hover:text-fg">
              Close
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    setError(null);
                  }}
                  className={cn(
                    "h-11 rounded-md px-1 font-mono text-[11px] transition-colors duration-150",
                    mode === m.id ? "bg-accent text-bg" : "bg-elevated text-muted hover:text-fg",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
              <span className="font-mono text-[10px] text-muted">
                {mode === "rtmp"
                  ? "RTMP PUBLISH"
                  : mode === "youtube"
                    ? "YOUTUBE URL"
                    : mode === "audio"
                      ? "AUDIO URL  ·  mp3 / aac / ogg"
                      : "URL"}
              </span>
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") apply();
                }}
                spellCheck={false}
                autoComplete="off"
                placeholder={
                  mode === "rtmp"
                    ? "rtmp://ingest.example.com/live/key"
                    : mode === "youtube"
                      ? "https://youtube.com/watch?v=…  or  /live/…"
                      : mode === "audio"
                        ? "https://cdn.example.com/bed.mp3"
                        : "https://…m3u8   ·   youtube.com   ·   rtmp://   ·   .mp3"
                }
                className="bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
                autoFocus
              />
            </label>

            {showPlayback ? (
              <label className="flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2">
                <span className="font-mono text-[10px] text-muted">PLAYBACK  ·  HLS / HTTP-FLV</span>
                <input
                  value={playback}
                  onChange={(e) => {
                    setPlayback(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") apply();
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="https://cdn.example.com/live.m3u8"
                  className="bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
                />
              </label>
            ) : null}

            {showPoster ? (
              <div className="flex flex-col gap-2 rounded-md bg-elevated p-3">
                <span className="font-mono text-[10px] text-muted">
                  POSTER  ·  audio-only still
                </span>
                <input
                  value={poster}
                  onChange={(e) => setPoster(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="https://…jpg  or choose a file"
                  className="bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
                />
                <div className="flex items-center gap-2">
                  <label className="flex h-11 flex-1 items-center justify-center rounded-md bg-surface font-mono text-[11px] text-fg">
                    Choose image
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        void posterFromFile(file)
                          .then((data) => {
                            setPoster(data);
                            setError(null);
                          })
                          .catch(() => setError("Could not read that image"));
                      }}
                    />
                  </label>
                  {poster ? (
                    <img
                      src={poster}
                      alt=""
                      className="h-11 w-16 rounded-sm object-cover"
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {mode === "audio" ? (
              <p className="font-mono text-[11px] leading-5 text-muted">
                Audio beds play under Program with a still poster. Assign an mp3/aac/ogg URL, then
                set a thumbnail so the bus is not a black frame.
              </p>
            ) : mode === "rtmp" ? (
              <p className="font-mono text-[11px] leading-5 text-muted">
                Browsers cannot ingest RTMP. Keep the publish URL for your encoder, then paste the
                HLS or HTTP-FLV playback URL your CDN exposes.
              </p>
            ) : (
              <p className="font-mono text-[11px] leading-5 text-muted">
                YouTube, HLS, HTTP-FLV and files sit under Preview/Program. Same CUT / AUTO /
                overlays as the studio cameras.
              </p>
            )}

            <div className="flex flex-wrap gap-1">
              {SAMPLES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setMode(s.mode);
                    setUrl(s.url);
                    setPlayback("");
                    setPoster(s.poster ?? "");
                    setError(null);
                  }}
                  className="h-11 rounded-md bg-elevated px-3 font-mono text-[11px] text-muted hover:text-fg"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {!("kind" in preview) && url.trim() ? (
              <p className="font-mono text-[11px] text-program">{preview.error}</p>
            ) : error ? (
              <p className="font-mono text-[11px] text-program">{error}</p>
            ) : url.trim() && "kind" in preview ? (
              <p className="font-mono text-[11px] text-ok">
                {preview.label}
                {preview.audioOnly ? "  ·  audio-only" : ""}
                {preview.poster ? "  ·  poster set" : ""}
                {preview.kind === "rtmp" && !preview.playbackUrl ? "  ·  waiting on playback URL" : ""}
                {preview.youtubeId ? `  ·  ${preview.youtubeId}` : ""}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => {
                clearFeed(inputId);
                onClose();
              }}
              className="h-12 rounded-md px-3 font-mono text-[11px] text-muted hover:text-fg"
            >
              Clear
            </button>
            <div className="flex gap-1.5">
              <Dialog.Close className="h-12 rounded-md bg-elevated px-4 font-mono text-[11px] text-muted hover:text-fg">
                Cancel
              </Dialog.Close>
              <button
                type="button"
                onClick={apply}
                className="h-12 rounded-md bg-fg px-5 font-mono text-[11px] font-semibold text-bg"
              >
                Assign
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
