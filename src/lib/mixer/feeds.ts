export type FeedKind = "youtube" | "hls" | "flv" | "file" | "rtmp" | "audio";

export type FeedStatus = "idle" | "connecting" | "live" | "error";

export interface InputFeed {
  kind: FeedKind;
  url: string;
  playbackUrl?: string;
  youtubeId?: string;
  label: string;
  status: FeedStatus;
  error?: string;
  audioOnly?: boolean;
  poster?: string;
}

export const SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
export const SAMPLE_YOUTUBE = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
export const SAMPLE_YOUTUBE_LIVE = "https://www.youtube.com/watch?v=jfKfPfyJRdk";
export const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
export const SAMPLE_POSTER = "/inputs/media.jpg";

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac)(\?|$)/i;

export function youtubeIdFromUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (YT_ID.test(trimmed)) return trimmed;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && YT_ID.test(id) ? id : null;
  }
  if (!host.endsWith("youtube.com") && !host.endsWith("youtube-nocookie.com")) return null;
  const v = url.searchParams.get("v");
  if (v && YT_ID.test(v)) return v;
  const parts = url.pathname.split("/").filter(Boolean);
  const marker = parts.findIndex((p) => p === "embed" || p === "live" || p === "shorts" || p === "v");
  if (marker >= 0) {
    const id = parts[marker + 1];
    if (id && YT_ID.test(id)) return id;
  }
  return null;
}

function youtubeFeed(url: string, yt: string): InputFeed {
  const live = /\/live(\/|\?|$)/i.test(url) || /[?&]live=1\b/i.test(url);
  return {
    kind: "youtube",
    url: `https://www.youtube.com/watch?v=${yt}`,
    youtubeId: yt,
    label: live ? "YouTube Live" : "YouTube",
    status: "connecting",
  };
}

function audioFeed(url: string, poster?: string): InputFeed {
  return {
    kind: "audio",
    url,
    label: "Audio",
    status: "connecting",
    audioOnly: true,
    poster: poster?.trim() || undefined,
  };
}

export function parseFeedUrl(
  raw: string,
  force: FeedKind | "auto" = "auto",
  poster?: string,
): InputFeed | { error: string } {
  const url = raw.trim();
  if (!url) return { error: "Paste a YouTube, HLS, RTMP, file, or audio URL" };

  if (force === "audio") {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Audio needs an https URL" };
      }
    } catch {
      return { error: "Audio URL looks invalid" };
    }
    return audioFeed(url, poster);
  }

  if (force === "youtube") {
    const yt = youtubeIdFromUrl(url);
    if (!yt) return { error: "Not a YouTube URL or 11-character video id" };
    return youtubeFeed(url, yt);
  }

  if (force === "rtmp") {
    if (/^rtmps?:\/\//i.test(url)) {
      return { kind: "rtmp", url, label: "RTMP", status: "idle" };
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { error: "RTMP needs rtmp:// or an HTTPS playback URL" };
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { error: "RTMP playback must be HLS, FLV, or rtmp://" };
    }
    return { kind: "rtmp", url, playbackUrl: url, label: "RTMP", status: "connecting" };
  }

  if (force === "hls" || force === "flv" || force === "file") {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Use an https URL for this source" };
      }
    } catch {
      return { error: "URL looks invalid" };
    }
    const label = force === "flv" ? "HTTP-FLV" : force === "file" ? "File" : "HLS";
    return { kind: force, url, label, status: "connecting" };
  }

  const yt = youtubeIdFromUrl(url);
  if (yt) return youtubeFeed(url, yt);

  if (/^rtmps?:\/\//i.test(url)) {
    return { kind: "rtmp", url, label: "RTMP", status: "idle" };
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    return { error: "URL looks invalid" };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { error: "Use https, http, rtmp, or a YouTube link" };
  }

  const path = parsed.pathname.toLowerCase();
  const full = url.toLowerCase();
  if (AUDIO_EXT.test(path) || AUDIO_EXT.test(full)) {
    return audioFeed(url, poster);
  }
  if (path.endsWith(".m3u8") || full.includes(".m3u8")) {
    return { kind: "hls", url, label: "HLS", status: "connecting" };
  }
  if (path.endsWith(".flv") || full.includes(".flv") || /\/flv(\/|\?|$)/.test(full)) {
    return { kind: "flv", url, label: "HTTP-FLV", status: "connecting" };
  }
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(path)) {
    return { kind: "file", url, label: "File", status: "connecting" };
  }
  if (/\/(live|hls|hls2|stream)\b/i.test(path)) {
    return { kind: "hls", url, label: "HLS", status: "connecting" };
  }
  return { kind: "hls", url, label: "Stream", status: "connecting", poster: poster?.trim() || undefined };
}

export function withPlayback(feed: InputFeed, playbackUrl?: string, poster?: string): InputFeed {
  const next = { ...feed };
  if (poster?.trim()) next.poster = poster.trim();
  const play = playbackUrl?.trim();
  if (!play) return next;
  if (feed.kind !== "rtmp") return next;
  return { ...next, playbackUrl: play, status: "connecting", error: undefined };
}

export function playableUrl(feed: InputFeed): string | null {
  if (feed.kind === "youtube") return null;
  if (feed.kind === "rtmp") return feed.playbackUrl?.trim() || null;
  return feed.url;
}

export function playbackKind(feed: InputFeed): FeedKind | null {
  if (feed.kind === "audio" || feed.audioOnly) return "audio";
  const url = playableUrl(feed);
  if (!url) return feed.kind === "youtube" ? "youtube" : null;
  const parsed = parseFeedUrl(url);
  if ("error" in parsed) return feed.kind === "rtmp" ? "hls" : feed.kind;
  if (parsed.kind === "rtmp" || parsed.kind === "youtube") return "hls";
  return parsed.kind;
}

export function isDomFeed(
  feed?: InputFeed | null,
): feed is InputFeed & { kind: "youtube"; youtubeId: string } {
  return Boolean(feed && feed.kind === "youtube" && feed.youtubeId);
}

export function youtubeEmbedSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    enablejsapi: "1",
    loop: "1",
    playlist: id,
    origin: typeof window !== "undefined" ? window.location.origin : "",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function mixProgress(startedAt: number, durationMs: number, now = Date.now()) {
  const raw = Math.min(1, Math.max(0, (now - startedAt) / Math.max(1, durationMs)));
  return raw * raw * (3 - 2 * raw);
}

export function feedBadge(feed?: InputFeed | null) {
  if (!feed) return null;
  if (feed.status === "error") return "ERR";
  if (feed.kind === "audio" || feed.audioOnly) return "AUD";
  if (feed.kind === "rtmp" && !feed.playbackUrl) return "RTMP";
  return feed.label;
}

export function isAudioFeed(feed?: InputFeed | null) {
  return Boolean(feed && (feed.kind === "audio" || feed.audioOnly));
}
