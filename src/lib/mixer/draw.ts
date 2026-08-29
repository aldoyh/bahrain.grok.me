import { SHOW_EP, SHOW_NAME, OVERLAYS, inputById } from "./catalog";
import { getWebcamVideo } from "./capture";
import { getFeedVideo } from "./players";
import { isAudioFeed, isDomFeed, mixProgress } from "./feeds";
import { useMixer } from "./store";
import { pad2 } from "../utils";
import type { MixInput, MixerSnapshot, TransitionJob } from "./types";

const images = new Map<string, HTMLImageElement>();

function img(src: string) {
  let el = images.get(src);
  if (el) return el.complete && el.naturalWidth > 0 ? el : null;
  el = new Image();
  el.crossOrigin = "anonymous";
  el.src = src;
  images.set(src, el);
  return null;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

function coverImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  w: number,
  h: number,
  zoom: number,
  panX: number,
  panY: number,
  iw: number,
  ih: number,
) {
  const scale = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (w - dw) / 2 + panX * w;
  const dy = (h - dh) / 2 + panY * h;
  ctx.drawImage(image, dx, dy, dw, dh);
}

function kenBurns(id: string, t: number) {
  const phase = hash(id) * Math.PI * 2;
  const zoom = 1.04 + Math.sin(t * 0.00006 + phase) * 0.02;
  const panX = Math.cos(t * 0.00004 + phase) * 0.012;
  const panY = Math.sin(t * 0.00003 + phase * 0.7) * 0.01;
  return { zoom, panX, panY };
}

function drawBars(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const colors = ["#c9c9c9", "#c9c90c", "#0cc9c9", "#0cc90c", "#c90cc9", "#c90c0c", "#0c0cc9"];
  const top = h * 0.68;
  const barW = w / 7;
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = colors[i]!;
    ctx.fillRect(i * barW, 0, barW + 1, top);
  }
  const mid = h * 0.08;
  const midColors = ["#0c0cc9", "#111", "#c90cc9", "#111", "#0cc9c9", "#111", "#c9c9c9"];
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = midColors[i]!;
    ctx.fillRect(i * barW, top, barW + 1, mid);
  }
  const bot = h - top - mid;
  const pluge = ["#090909", "#111", "#1a1a1a", "#111", "#000"];
  const pw = w / 5;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = pluge[i]!;
    ctx.fillRect(i * pw, top + mid, pw + 1, bot);
  }
}

function drawClock(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const now = new Date();
  ctx.fillStyle = "#0b0d10";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#eceff3";
  ctx.font = `600 ${Math.floor(w * 0.14)}px "IBM Plex Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`,
    w / 2,
    h * 0.48,
  );
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.032)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText("MANAMA  ·  AST", w / 2, h * 0.64);
  ctx.fillText(
    now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    w / 2,
    h * 0.72,
  );
}

function drawSlate(ctx: CanvasRenderingContext2D, w: number, h: number, tc: string) {
  ctx.fillStyle = "#0c0f12";
  ctx.fillRect(0, 0, w, h);
  const x = w * 0.14;
  const y = h * 0.18;
  const bw = w * 0.72;
  const bh = h * 0.64;
  ctx.strokeStyle = "#c8ced6";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, bw, bh);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "left";
  ctx.font = `600 ${Math.floor(w * 0.038)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText("PRODUCTION SLATE", x + 24, y + 42);
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.022)}px "IBM Plex Mono", monospace`;
  const rows = [
    ["SHOW", SHOW_NAME],
    ["EPISODE", SHOW_EP],
    ["ENGINE", "ffmix-cli"],
    ["TC", tc],
    ["FMT", "1080p50  ·  Rec.709"],
  ];
  rows.forEach((row, i) => {
    ctx.fillStyle = "#5c656e";
    ctx.fillText(row[0]!, x + 24, y + 92 + i * 36);
    ctx.fillStyle = "#eceff3";
    ctx.fillText(row[1]!, x + 160, y + 92 + i * 36);
  });
}

function drawTitle(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#08090b";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2fd67a";
  ctx.fillRect(w * 0.5 - 48, h * 0.42, 96, 3);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "center";
  ctx.font = `600 ${Math.floor(w * 0.072)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(SHOW_NAME.toUpperCase(), w / 2, h * 0.4);
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.024)}px "IBM Plex Mono", monospace`;
  ctx.fillText("ffmix-cli  ·  LIVE", w / 2, h * 0.52);
}

function drawFallback(ctx: CanvasRenderingContext2D, input: MixInput, w: number, h: number) {
  ctx.fillStyle = "#14181d";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.floor(w * 0.06)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(input.name, w / 2, h / 2);
}

function drawPhoto(ctx: CanvasRenderingContext2D, input: MixInput, w: number, h: number, t: number) {
  if (!input.src) {
    drawFallback(ctx, input, w, h);
    return;
  }
  const image = img(input.src);
  if (!image) {
    drawFallback(ctx, input, w, h);
    return;
  }
  const kb = kenBurns(input.id, t);
  coverImage(ctx, image, w, h, kb.zoom, kb.panX, kb.panY, image.naturalWidth, image.naturalHeight);
}

function drawWebcam(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const video = getWebcamVideo();
  if (!video || video.readyState < 2) {
    ctx.fillStyle = "#101318";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#8b939c";
    ctx.textAlign = "center";
    ctx.font = `500 ${Math.floor(w * 0.028)}px "IBM Plex Sans", sans-serif`;
    ctx.fillText("CAM 0  ·  enable local camera", w / 2, h / 2);
    return;
  }
  coverImage(ctx, video, w, h, 1.02, 0, 0, video.videoWidth || 1280, video.videoHeight || 720);
}

function drawLiveSlate(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  detail: string,
  status: string,
) {
  ctx.fillStyle = "#0c0f12";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e23b3b";
  ctx.fillRect(w * 0.5 - 36, h * 0.34, 72, 3);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.floor(w * 0.042)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(title, w / 2, h * 0.44);
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.022)}px "IBM Plex Mono", monospace`;
  ctx.fillText(status.toUpperCase(), w / 2, h * 0.54);
  ctx.fillStyle = "#5c656e";
  ctx.font = `400 ${Math.floor(w * 0.018)}px "IBM Plex Mono", monospace`;
  const clip = detail.length > 48 ? `${detail.slice(0, 46)}…` : detail;
  ctx.fillText(clip, w / 2, h * 0.62);
}

function drawAudioPlate(
  ctx: CanvasRenderingContext2D,
  input: MixInput,
  w: number,
  h: number,
  t: number,
  poster?: string,
) {
  const art = poster ? img(poster) : input.src ? img(input.src) : null;
  if (art) {
    coverImage(ctx, art, w, h, 1.04, 0, 0, art.naturalWidth, art.naturalHeight);
    ctx.fillStyle = "rgba(8,9,11,0.55)";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = "#101318";
    ctx.fillRect(0, 0, w, h);
  }
  const bars = 7;
  const bw = Math.max(6, w * 0.012);
  const gap = bw * 0.7;
  const total = bars * bw + (bars - 1) * gap;
  const x0 = (w - total) / 2;
  const base = h * 0.62;
  for (let i = 0; i < bars; i++) {
    const n = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.006 + i * 0.7));
    const bh = h * 0.12 * n;
    ctx.fillStyle = i === 3 ? "#2fd67a" : "#c8ced6";
    ctx.fillRect(x0 + i * (bw + gap), base - bh, bw, bh);
  }
  ctx.fillStyle = "#2fd67a";
  ctx.fillRect(w * 0.5 - 28, h * 0.38, 56, 3);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.floor(w * 0.038)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(input.name, w / 2, h * 0.44);
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.02)}px "IBM Plex Mono", monospace`;
  ctx.fillText("AUDIO  ·  poster bed", w / 2, h * 0.52);
}

function drawFeed(
  ctx: CanvasRenderingContext2D,
  input: MixInput,
  w: number,
  h: number,
  t: number,
  tc: string,
) {
  const feed = useMixer.getState().feeds[input.id];
  if (feed) {
    if (isDomFeed(feed)) return;
    if (isAudioFeed(feed)) {
      drawAudioPlate(ctx, input, w, h, t, feed.poster);
      return;
    }
    const video = getFeedVideo(input.id);
    if (video && video.readyState >= 2 && (video.videoWidth || 0) > 0) {
      coverImage(ctx, video, w, h, 1.02, 0, 0, video.videoWidth, video.videoHeight);
      return;
    }
    if (video && video.readyState >= 2 && (video.videoWidth || 0) === 0) {
      drawAudioPlate(ctx, input, w, h, t, feed.poster);
      return;
    }
    const detail = feed.playbackUrl || feed.url;
    const status =
      feed.kind === "rtmp" && !feed.playbackUrl
        ? "set HLS / FLV playback to see picture"
        : feed.error || feed.status;
    drawLiveSlate(ctx, w, h, `${input.name}  ·  ${feed.label}`, detail, status);
    return;
  }
  switch (input.kind) {
    case "bars":
      drawBars(ctx, w, h);
      break;
    case "clock":
      drawClock(ctx, w, h);
      break;
    case "slate":
      drawSlate(ctx, w, h, tc);
      break;
    case "title":
      drawTitle(ctx, w, h);
      break;
    case "webcam":
      drawWebcam(ctx, w, h);
      break;
    default: {
      ctx.save();
      ctx.filter = "brightness(1.18) contrast(1.08) saturate(1.06)";
      drawPhoto(ctx, input, w, h, t);
      ctx.restore();
    }
  }
}

export function drawInput(
  ctx: CanvasRenderingContext2D,
  input: MixInput,
  w: number,
  h: number,
  t: number,
  tc: string,
) {
  drawFeed(ctx, input, w, h, t, tc);
}

function sourceIsDom(id: string) {
  return isDomFeed(useMixer.getState().feeds[id]);
}

function mixEase(p: number) {
  return p * p * (3 - 2 * p);
}

function applyTransition(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  job: TransitionJob,
  from: MixInput,
  to: MixInput,
  t: number,
  tc: string,
) {
  const p = mixProgress(job.startedAt, job.durationMs, t);
  const fromDom = sourceIsDom(from.id);
  const toDom = sourceIsDom(to.id);

  if (fromDom && toDom) return;

  if (job.kind === "fade") {
    if (toDom) {
      ctx.save();
      ctx.globalAlpha = 1 - p;
      drawInput(ctx, from, w, h, t, tc);
      ctx.restore();
      return;
    }
    if (fromDom) {
      ctx.save();
      ctx.globalAlpha = p;
      drawInput(ctx, to, w, h, t, tc);
      ctx.restore();
      return;
    }
    drawInput(ctx, from, w, h, t, tc);
    ctx.save();
    ctx.globalAlpha = p;
    drawInput(ctx, to, w, h, t, tc);
    ctx.restore();
    return;
  }
  if (job.kind === "wipe") {
    if (toDom) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(w * p, 0, w * (1 - p) + 1, h);
      ctx.clip();
      drawInput(ctx, from, w, h, t, tc);
      ctx.restore();
    } else if (fromDom) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w * p, h);
      ctx.clip();
      drawInput(ctx, to, w, h, t, tc);
      ctx.restore();
    } else {
      drawInput(ctx, from, w, h, t, tc);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w * p, h);
      ctx.clip();
      drawInput(ctx, to, w, h, t, tc);
      ctx.restore();
    }
    ctx.fillStyle = "#eceff3";
    ctx.fillRect(w * p - 1, 0, 2, h);
    return;
  }
  if (job.kind === "slide") {
    if (!fromDom) {
      ctx.save();
      ctx.translate(-w * p, 0);
      drawInput(ctx, from, w, h, t, tc);
      ctx.restore();
    }
    if (!toDom) {
      ctx.save();
      ctx.translate(w * (1 - p), 0);
      drawInput(ctx, to, w, h, t, tc);
      ctx.restore();
    }
    return;
  }
  if (toDom) {
    ctx.save();
    ctx.globalAlpha = 1 - p;
    if (!fromDom) drawInput(ctx, from, w, h, t, tc);
    ctx.restore();
    return;
  }
  if (!fromDom) drawInput(ctx, from, w, h, t, tc);
  ctx.save();
  ctx.globalAlpha = p;
  const s = 1.12 - p * 0.12;
  ctx.translate(w / 2, h / 2);
  ctx.scale(s, s);
  ctx.translate(-w / 2, -h / 2);
  drawInput(ctx, to, w, h, t, tc);
  ctx.restore();
}

function gfxAmount(index: 0 | 1 | 2 | 3, now: number) {
  const s = useMixer.getState();
  if (!s.overlays[index] && !s.overlayOut[index]) return 0;
  const spec = OVERLAYS[index]!;
  const dur = s.overlayOut[index] ? spec.outMs : spec.inMs;
  const raw = Math.min(1, Math.max(0, (now - s.overlayAt[index]) / Math.max(1, dur)));
  const eased = raw * raw * (3 - 2 * raw);
  return s.overlayOut[index] ? 1 - eased : eased;
}

function drawLowerThird(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  name: string,
  title: string,
  p: number,
  tickerUp: boolean,
) {
  if (p <= 0.01) return;
  const x = w * 0.06 - (1 - p) * w * 0.22;
  const y = (tickerUp ? h * 0.62 : h * 0.72);
  const bw = Math.min(w * 0.52, 640);
  const bh = h * 0.16;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.fillStyle = "rgba(8,9,11,0.82)";
  ctx.fillRect(x, y, bw, bh);
  ctx.fillStyle = "#2fd67a";
  ctx.fillRect(x, y, 5, bh);
  ctx.fillStyle = "#eceff3";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 ${Math.floor(w * 0.032)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(name, x + 22, y + h * 0.075);
  ctx.fillStyle = "#8b939c";
  ctx.font = `500 ${Math.floor(w * 0.02)}px "IBM Plex Sans", sans-serif`;
  ctx.fillText(title, x + 22, y + h * 0.125);
  ctx.restore();
}

function drawBug(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  if (p <= 0.01) return;
  const bw = 100;
  const bh = 28;
  const x = w - 118;
  const y = 18;
  const cx = x + bw;
  const cy = y;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.translate(cx, cy);
  ctx.scale(0.92 + 0.08 * p, 0.92 + 0.08 * p);
  ctx.translate(-cx, -cy);
  ctx.fillStyle = "rgba(8,9,11,0.72)";
  ctx.fillRect(x, y, bw, bh);
  ctx.fillStyle = "#e23b3b";
  ctx.fillRect(x, y, 3, bh);
  ctx.fillStyle = "#eceff3";
  ctx.font = `600 12px "IBM Plex Mono", monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("ffmix", x + 14, y + 15);
  ctx.restore();
}

function drawTicker(ctx: CanvasRenderingContext2D, w: number, h: number, text: string, t: number, p: number) {
  if (p <= 0.01) return;
  const y = h - 28 + (1 - p) * 36;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.fillStyle = "rgba(8,9,11,0.88)";
  ctx.fillRect(0, y, w, 28);
  ctx.fillStyle = "#e23b3b";
  ctx.fillRect(0, y, 54, 28);
  ctx.fillStyle = "#eceff3";
  ctx.font = `600 11px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LIVE", 27, y + 15);
  ctx.beginPath();
  ctx.rect(54, y, w - 54, 28);
  ctx.clip();
  ctx.fillStyle = "#eceff3";
  ctx.font = `500 12px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = "left";
  const loop = `${text}    ·    ${text}    ·    `;
  const width = ctx.measureText(loop).width;
  const x = 64 - ((t * 0.05) % width);
  ctx.fillText(loop, x, y + 15);
  ctx.fillText(loop, x + width, y + 15);
  ctx.restore();
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  home: string,
  away: string,
  hn: number,
  an: number,
  p: number,
) {
  if (p <= 0.01) return;
  const x = 16;
  const y = 16 - (1 - p) * 44;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.fillStyle = "rgba(8,9,11,0.82)";
  ctx.fillRect(x, y, 168, 52);
  ctx.fillStyle = "#eceff3";
  ctx.font = `600 11px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(home, x + 10, y + 16);
  ctx.fillText(away, x + 10, y + 36);
  ctx.font = `600 16px "IBM Plex Mono", monospace`;
  ctx.textAlign = "right";
  ctx.fillText(String(hn), x + 156, y + 16);
  ctx.fillText(String(an), x + 156, y + 36);
  ctx.restore();
}

export function drawBus(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  which: "program" | "preview",
  state: MixerSnapshot,
  t: number,
  tc: string,
) {
  ctx.clearRect(0, 0, w, h);
  const job = which === "program" ? state.transitioning : null;
  const activeId = which === "program" ? state.programId : state.previewId;
  const active = inputById(activeId);
  if (job) {
    const from = inputById(job.fromId);
    const to = inputById(job.toId);
    if (from && to) applyTransition(ctx, w, h, job, from, to, t, tc);
    else if (active) drawInput(ctx, active, w, h, t, tc);
  } else if (active) {
    drawInput(ctx, active, w, h, t, tc);
  }

  if (which === "program") {
    const scoreP = gfxAmount(3, t);
    const bugP = gfxAmount(1, t);
    const tickP = gfxAmount(2, t);
    const ltP = gfxAmount(0, t);
    if (scoreP > 0) {
      drawScore(ctx, w, h, state.scoreHome, state.scoreAway, state.scoreHomeN, state.scoreAwayN, scoreP);
    }
    if (bugP > 0) drawBug(ctx, w, h, bugP);
    if (ltP > 0) {
      drawLowerThird(ctx, w, h, state.lowerThirdName, state.lowerThirdTitle, ltP, tickP > 0.2);
    }
    if (tickP > 0) drawTicker(ctx, w, h, state.ticker, t, tickP);
  }
}

export function preloadInputs() {
  for (const src of ["/inputs/cam1.jpg", "/inputs/cam2.jpg", "/inputs/cam3.jpg", "/inputs/cam4.jpg", "/inputs/media.jpg"]) {
    img(src);
  }
}
