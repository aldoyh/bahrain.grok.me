import { useEffect, useState } from "react";
import { useMixer } from "@/lib/mixer/store";
import { isDomFeed, youtubeEmbedSrc } from "@/lib/mixer/feeds";
import { cn } from "@/lib/utils";

function ytCommand(iframe: HTMLIFrameElement | null, func: "mute" | "unMute" | "playVideo") {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

function YoutubeLayer({
  videoId,
  mute,
  style,
  durationMs,
}: {
  videoId: string;
  mute: boolean;
  style: React.CSSProperties;
  durationMs: number;
}) {
  const [node, setNode] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const apply = () => {
      ytCommand(node, "playVideo");
      ytCommand(node, mute ? "mute" : "unMute");
    };
    apply();
    const t = window.setInterval(apply, 1200);
    const stop = window.setTimeout(() => window.clearInterval(t), 5000);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(stop);
    };
  }, [mute, videoId, node]);

  return (
    <iframe
      ref={setNode}
      title="YouTube input"
      src={youtubeEmbedSrc(videoId)}
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => {
        ytCommand(node, "playVideo");
        ytCommand(node, mute ? "mute" : "unMute");
      }}
      className="pointer-events-none absolute inset-0 h-full w-full border-0"
      style={{
        ...style,
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}

function layerStyle(
  which: "program" | "preview",
  role: "from" | "to" | "solo",
  job: { kind: string; durationMs: number } | null,
  armed: boolean,
): React.CSSProperties {
  if (which !== "program" || !job || role === "solo") {
    return { opacity: 1 };
  }
  const to = role === "to";
  const start = !armed;
  if (job.kind === "fade" || job.kind === "zoom") {
    const show = to ? !start : start;
    return {
      opacity: show ? 1 : 0,
      transform: job.kind === "zoom" && to ? (start ? "scale(1.12)" : "scale(1)") : undefined,
      transitionProperty: "opacity, transform",
    };
  }
  if (job.kind === "wipe") {
    return {
      clipPath: to
        ? start
          ? "inset(0 100% 0 0)"
          : "inset(0 0 0 0)"
        : start
          ? "inset(0 0 0 0)"
          : "inset(0 0 0 100%)",
      transitionProperty: "clip-path",
    };
  }
  if (job.kind === "slide") {
    return {
      transform: to
        ? start
          ? "translateX(100%)"
          : "translateX(0%)"
        : start
          ? "translateX(0%)"
          : "translateX(-100%)",
      transitionProperty: "transform",
    };
  }
  return { opacity: to ? (start ? 0 : 1) : start ? 1 : 0, transitionProperty: "opacity" };
}

export function FeedStage({ which }: { which: "program" | "preview" }) {
  const programId = useMixer((s) => s.programId);
  const previewId = useMixer((s) => s.previewId);
  const transitioning = useMixer((s) => s.transitioning);
  const feeds = useMixer((s) => s.feeds);
  const masterMuted = useMixer((s) => s.mutes.master);
  const jobKey = transitioning
    ? `${transitioning.fromId}:${transitioning.toId}:${transitioning.startedAt}`
    : "";
  const [armedKey, setArmedKey] = useState("");
  const armed = Boolean(jobKey) && armedKey === jobKey;

  useEffect(() => {
    if (!jobKey) {
      setArmedKey("");
      return;
    }
    setArmedKey("");
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setArmedKey(jobKey));
    });
    return () => cancelAnimationFrame(id);
  }, [jobKey]);

  const activeId = which === "program" ? programId : previewId;
  const job = which === "program" ? transitioning : null;
  const fromFeed = job ? feeds[job.fromId] : undefined;
  const toFeed = job ? feeds[job.toId] : undefined;
  const activeFeed = feeds[activeId];
  const durationMs = job?.durationMs ?? 240;

  const layers: {
    inputId: string;
    role: "from" | "to" | "solo";
    videoId: string;
    mute: boolean;
  }[] = [];

  if (job) {
    if (isDomFeed(fromFeed) && fromFeed.youtubeId) {
      layers.push({ inputId: job.fromId, role: "from", videoId: fromFeed.youtubeId, mute: true });
    }
    if (isDomFeed(toFeed) && toFeed.youtubeId) {
      layers.push({
        inputId: job.toId,
        role: "to",
        videoId: toFeed.youtubeId,
        mute: masterMuted,
      });
    }
  } else if (isDomFeed(activeFeed) && activeFeed.youtubeId) {
    layers.push({
      inputId: activeId,
      role: "solo",
      videoId: activeFeed.youtubeId,
      mute: which !== "program" || masterMuted,
    });
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-bg")}>
      {layers.map((layer) => (
        <YoutubeLayer
          key={layer.inputId}
          videoId={layer.videoId}
          mute={layer.mute}
          durationMs={durationMs}
          style={layerStyle(which, layer.role, job, armed)}
        />
      ))}
    </div>
  );
}
