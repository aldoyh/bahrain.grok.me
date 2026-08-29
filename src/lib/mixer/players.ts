import type { InputFeed } from "./feeds";
import { playbackKind, playableUrl } from "./feeds";

const videos = new Map<string, HTMLVideoElement>();
const hlsPlayers = new Map<string, { destroy: () => void }>();
const flvPlayers = new Map<string, { pause: () => void; unload: () => void; detachMediaElement: () => void; destroy: () => void }>();
const attachGen = new Map<string, number>();

export function getFeedVideo(id: string) {
  return videos.get(id) ?? null;
}

export function listFeedVideos() {
  return videos;
}

function destroy(id: string) {
  const hls = hlsPlayers.get(id);
  if (hls) {
    hls.destroy();
    hlsPlayers.delete(id);
  }
  const flv = flvPlayers.get(id);
  if (flv) {
    try {
      flv.pause();
      flv.unload();
      flv.detachMediaElement();
      flv.destroy();
    } catch {
      /* already torn down */
    }
    flvPlayers.delete(id);
  }
  const video = videos.get(id);
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.srcObject = null;
    video.load();
    video.remove();
    videos.delete(id);
  }
}

function ensureVideo(id: string) {
  let video = videos.get(id);
  if (video) return video;
  video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  video.loop = false;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.style.cssText =
    "position:fixed;left:-9999px;top:0;width:4px;height:4px;opacity:0;pointer-events:none";
  document.body.appendChild(video);
  videos.set(id, video);
  return video;
}

export function detachFeed(id: string) {
  attachGen.set(id, (attachGen.get(id) ?? 0) + 1);
  destroy(id);
}

export function attachFeed(
  id: string,
  feed: InputFeed,
  onStatus: (status: InputFeed["status"], error?: string) => void,
) {
  destroy(id);
  const token = (attachGen.get(id) ?? 0) + 1;
  attachGen.set(id, token);
  const alive = () => attachGen.get(id) === token;

  const kind = playbackKind(feed);
  if (feed.kind === "youtube" || kind === "youtube") {
    onStatus("live");
    return;
  }
  const url = playableUrl(feed);
  if (feed.kind === "rtmp" && !url) {
    onStatus("idle");
    return;
  }
  if (!url || !kind || kind === "rtmp") {
    onStatus("error", "No playback URL");
    return;
  }

  const video = ensureVideo(id);
  video.loop = kind === "file" || kind === "audio";
  video.onplaying = () => {
    if (alive()) onStatus("live");
  };
  video.onerror = () => {
    if (alive()) onStatus("error", "Playback failed");
  };
  onStatus("connecting");

  void (async () => {
    try {
      if (kind === "audio") {
        video.src = url;
        void video.play().catch(() => {
          if (alive()) onStatus("error", "Autoplay blocked");
        });
        return;
      }

      if (kind === "hls") {
        const { default: Hls } = await import("hls.js");
        if (!alive()) return;
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
          });
          hlsPlayers.set(id, hls);
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!alive()) return;
            void video.play().catch(() => onStatus("error", "Autoplay blocked"));
          });
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal && alive()) onStatus("error", data.details || "HLS error");
          });
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
          void video.play().catch(() => {
            if (alive()) onStatus("error", "Autoplay blocked");
          });
          return;
        }
        onStatus("error", "HLS not supported");
        return;
      }

      if (kind === "flv") {
        const mpegts = (await import("mpegts.js")).default;
        if (!alive()) return;
        if (!mpegts.isSupported()) {
          onStatus("error", "FLV not supported");
          return;
        }
        const player = mpegts.createPlayer(
          { type: "flv", url, isLive: true, hasAudio: true, hasVideo: true, cors: true },
          { enableWorker: true, liveBufferLatencyChasing: true },
        );
        flvPlayers.set(id, player);
        player.attachMediaElement(video);
        player.load();
        void player.play();
        player.on(mpegts.Events.ERROR, (...args: unknown[]) => {
          if (alive()) onStatus("error", String(args[1] || "FLV error"));
        });
        return;
      }

      video.src = url;
      void video.play().catch(() => {
        if (alive()) onStatus("error", "Autoplay blocked");
      });
    } catch (err) {
      if (alive()) onStatus("error", err instanceof Error ? err.message : "Attach failed");
    }
  })();
}

export function syncFeedMute(programId: string, masterMuted: boolean) {
  for (const [id, video] of videos) {
    video.muted = id !== programId || masterMuted;
  }
}

export function destroyAllFeeds() {
  for (const id of [...videos.keys()]) detachFeed(id);
}
