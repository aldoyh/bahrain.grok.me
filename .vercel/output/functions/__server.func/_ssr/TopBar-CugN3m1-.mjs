import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Radio, o as Circle } from "../_libs/lucide-react.mjs";
import { C as isDomFeed, D as youtubeEmbedSrc, S as isAudioFeed, a as getWebcamVideo, f as SHOW_NAME, h as getFeedVideo, n as useMixer, o as setProgramCanvas, p as inputById, u as OVERLAYS, w as mixProgress, x as feedBadge } from "./router-FzZyU0qp.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TopBar-CugN3m1-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHANNEL = "ffmix-reverb";
function useReverb(role, _name) {
	const selfRef = (0, import_react.useRef)(`ff-${Math.random().toString(36).slice(2, 8)}`);
	const [joined, setJoined] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof BroadcastChannel === "undefined") return;
		const ch = new BroadcastChannel(CHANNEL);
		const self = selfRef.current;
		setJoined(true);
		ch.onmessage = (ev) => {
			const msg = ev.data;
			if (!msg || msg.v !== 1 || msg.from === self) return;
			if (msg.kind === "state") useMixer.getState().hydrate(msg.state);
		};
		const unsub = useMixer.subscribe((s, prev) => {
			if (role !== "director") return;
			if (s.programId === prev.programId && s.previewId === prev.previewId && s.overlays === prev.overlays && s.recording === prev.recording && s.streaming === prev.streaming && s.transitioning === prev.transitioning) return;
			const wire = {
				v: 1,
				from: self,
				kind: "state",
				state: s.snapshot()
			};
			ch.postMessage(wire);
		});
		return () => {
			unsub();
			ch.close();
		};
	}, [role]);
	return {
		peers: [],
		joined,
		selfId: selfRef.current,
		room: "local"
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function pad2(n) {
	return n < 10 ? `0${n}` : String(n);
}
function formatTc(ms) {
	const clamped = Math.max(0, ms);
	const h = Math.floor(clamped / 36e5);
	const m = Math.floor(clamped % 36e5 / 6e4);
	const s = Math.floor(clamped % 6e4 / 1e3);
	const f = Math.floor(clamped % 1e3 / 40);
	return `${pad2(h)}:${pad2(m)}:${pad2(s)}:${pad2(f)}`;
}
var images = /* @__PURE__ */ new Map();
function img(src) {
	let el = images.get(src);
	if (el) return el.complete && el.naturalWidth > 0 ? el : null;
	el = new Image();
	el.crossOrigin = "anonymous";
	el.src = src;
	images.set(src, el);
	return null;
}
function hash(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0) / 4294967295;
}
function coverImage(ctx, image, w, h, zoom, panX, panY, iw, ih) {
	const scale = Math.max(w / iw, h / ih) * zoom;
	const dw = iw * scale;
	const dh = ih * scale;
	const dx = (w - dw) / 2 + panX * w;
	const dy = (h - dh) / 2 + panY * h;
	ctx.drawImage(image, dx, dy, dw, dh);
}
function kenBurns(id, t) {
	const phase = hash(id) * Math.PI * 2;
	return {
		zoom: 1.04 + Math.sin(t * 6e-5 + phase) * .02,
		panX: Math.cos(t * 4e-5 + phase) * .012,
		panY: Math.sin(t * 3e-5 + phase * .7) * .01
	};
}
function drawBars(ctx, w, h) {
	const colors = [
		"#c9c9c9",
		"#c9c90c",
		"#0cc9c9",
		"#0cc90c",
		"#c90cc9",
		"#c90c0c",
		"#0c0cc9"
	];
	const top = h * .68;
	const barW = w / 7;
	for (let i = 0; i < 7; i++) {
		ctx.fillStyle = colors[i];
		ctx.fillRect(i * barW, 0, barW + 1, top);
	}
	const mid = h * .08;
	const midColors = [
		"#0c0cc9",
		"#111",
		"#c90cc9",
		"#111",
		"#0cc9c9",
		"#111",
		"#c9c9c9"
	];
	for (let i = 0; i < 7; i++) {
		ctx.fillStyle = midColors[i];
		ctx.fillRect(i * barW, top, barW + 1, mid);
	}
	const bot = h - top - mid;
	const pluge = [
		"#090909",
		"#111",
		"#1a1a1a",
		"#111",
		"#000"
	];
	const pw = w / 5;
	for (let i = 0; i < 5; i++) {
		ctx.fillStyle = pluge[i];
		ctx.fillRect(i * pw, top + mid, pw + 1, bot);
	}
}
function drawClock(ctx, w, h) {
	const now = /* @__PURE__ */ new Date();
	ctx.fillStyle = "#0b0d10";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#eceff3";
	ctx.font = `600 ${Math.floor(w * .14)}px "IBM Plex Mono", monospace`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(`${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`, w / 2, h * .48);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .032)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText("MANAMA  ·  AST", w / 2, h * .64);
	ctx.fillText(now.toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}), w / 2, h * .72);
}
function drawSlate(ctx, w, h, tc) {
	ctx.fillStyle = "#0c0f12";
	ctx.fillRect(0, 0, w, h);
	const x = w * .14;
	const y = h * .18;
	const bw = w * .72;
	const bh = h * .64;
	ctx.strokeStyle = "#c8ced6";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, bw, bh);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "left";
	ctx.font = `600 ${Math.floor(w * .038)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText("PRODUCTION SLATE", x + 24, y + 42);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .022)}px "IBM Plex Mono", monospace`;
	[
		["SHOW", SHOW_NAME],
		["EPISODE", "014"],
		["ENGINE", "ffmix-cli"],
		["TC", tc],
		["FMT", "1080p50  ·  Rec.709"]
	].forEach((row, i) => {
		ctx.fillStyle = "#5c656e";
		ctx.fillText(row[0], x + 24, y + 92 + i * 36);
		ctx.fillStyle = "#eceff3";
		ctx.fillText(row[1], x + 160, y + 92 + i * 36);
	});
}
function drawTitle(ctx, w, h) {
	ctx.fillStyle = "#08090b";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#2fd67a";
	ctx.fillRect(w * .5 - 48, h * .42, 96, 3);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "center";
	ctx.font = `600 ${Math.floor(w * .072)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(SHOW_NAME.toUpperCase(), w / 2, h * .4);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .024)}px "IBM Plex Mono", monospace`;
	ctx.fillText("ffmix-cli  ·  LIVE", w / 2, h * .52);
}
function drawFallback(ctx, input, w, h) {
	ctx.fillStyle = "#14181d";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `600 ${Math.floor(w * .06)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(input.name, w / 2, h / 2);
}
function drawPhoto(ctx, input, w, h, t) {
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
function drawWebcam(ctx, w, h) {
	const video = getWebcamVideo();
	if (!video || video.readyState < 2) {
		ctx.fillStyle = "#101318";
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = "#8b939c";
		ctx.textAlign = "center";
		ctx.font = `500 ${Math.floor(w * .028)}px "IBM Plex Sans", sans-serif`;
		ctx.fillText("CAM 0  ·  enable local camera", w / 2, h / 2);
		return;
	}
	coverImage(ctx, video, w, h, 1.02, 0, 0, video.videoWidth || 1280, video.videoHeight || 720);
}
function drawLiveSlate(ctx, w, h, title, detail, status) {
	ctx.fillStyle = "#0c0f12";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#e23b3b";
	ctx.fillRect(w * .5 - 36, h * .34, 72, 3);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `600 ${Math.floor(w * .042)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(title, w / 2, h * .44);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .022)}px "IBM Plex Mono", monospace`;
	ctx.fillText(status.toUpperCase(), w / 2, h * .54);
	ctx.fillStyle = "#5c656e";
	ctx.font = `400 ${Math.floor(w * .018)}px "IBM Plex Mono", monospace`;
	const clip = detail.length > 48 ? `${detail.slice(0, 46)}…` : detail;
	ctx.fillText(clip, w / 2, h * .62);
}
function drawAudioPlate(ctx, input, w, h, t, poster) {
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
	const bw = Math.max(6, w * .012);
	const gap = bw * .7;
	const x0 = (w - (bars * bw + 6 * gap)) / 2;
	const base = h * .62;
	for (let i = 0; i < bars; i++) {
		const n = .35 + .65 * Math.abs(Math.sin(t * .006 + i * .7));
		const bh = h * .12 * n;
		ctx.fillStyle = i === 3 ? "#2fd67a" : "#c8ced6";
		ctx.fillRect(x0 + i * (bw + gap), base - bh, bw, bh);
	}
	ctx.fillStyle = "#2fd67a";
	ctx.fillRect(w * .5 - 28, h * .38, 56, 3);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `600 ${Math.floor(w * .038)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(input.name, w / 2, h * .44);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .02)}px "IBM Plex Mono", monospace`;
	ctx.fillText("AUDIO  ·  poster bed", w / 2, h * .52);
}
function drawFeed(ctx, input, w, h, t, tc) {
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
		const status = feed.kind === "rtmp" && !feed.playbackUrl ? "set HLS / FLV playback to see picture" : feed.error || feed.status;
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
		default:
			ctx.save();
			ctx.filter = "brightness(1.18) contrast(1.08) saturate(1.06)";
			drawPhoto(ctx, input, w, h, t);
			ctx.restore();
	}
}
function drawInput(ctx, input, w, h, t, tc) {
	drawFeed(ctx, input, w, h, t, tc);
}
function sourceIsDom(id) {
	return isDomFeed(useMixer.getState().feeds[id]);
}
function applyTransition(ctx, w, h, job, from, to, t, tc) {
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
	const s = 1.12 - p * .12;
	ctx.translate(w / 2, h / 2);
	ctx.scale(s, s);
	ctx.translate(-w / 2, -h / 2);
	drawInput(ctx, to, w, h, t, tc);
	ctx.restore();
}
function gfxAmount(index, now) {
	const s = useMixer.getState();
	if (!s.overlays[index] && !s.overlayOut[index]) return 0;
	const spec = OVERLAYS[index];
	const dur = s.overlayOut[index] ? spec.outMs : spec.inMs;
	const raw = Math.min(1, Math.max(0, (now - s.overlayAt[index]) / Math.max(1, dur)));
	const eased = raw * raw * (3 - 2 * raw);
	return s.overlayOut[index] ? 1 - eased : eased;
}
function drawLowerThird(ctx, w, h, name, title, p, tickerUp) {
	if (p <= .01) return;
	const x = w * .06 - (1 - p) * w * .22;
	const y = tickerUp ? h * .62 : h * .72;
	const bw = Math.min(w * .52, 640);
	const bh = h * .16;
	ctx.save();
	ctx.globalAlpha = p;
	ctx.fillStyle = "rgba(8,9,11,0.82)";
	ctx.fillRect(x, y, bw, bh);
	ctx.fillStyle = "#2fd67a";
	ctx.fillRect(x, y, 5, bh);
	ctx.fillStyle = "#eceff3";
	ctx.textAlign = "left";
	ctx.textBaseline = "alphabetic";
	ctx.font = `600 ${Math.floor(w * .032)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(name, x + 22, y + h * .075);
	ctx.fillStyle = "#8b939c";
	ctx.font = `500 ${Math.floor(w * .02)}px "IBM Plex Sans", sans-serif`;
	ctx.fillText(title, x + 22, y + h * .125);
	ctx.restore();
}
function drawBug(ctx, w, h, p) {
	if (p <= .01) return;
	const bw = 100;
	const bh = 28;
	const x = w - 118;
	const y = 18;
	const cx = x + bw;
	const cy = y;
	ctx.save();
	ctx.globalAlpha = p;
	ctx.translate(cx, cy);
	ctx.scale(.92 + .08 * p, .92 + .08 * p);
	ctx.translate(-cx, -18);
	ctx.fillStyle = "rgba(8,9,11,0.72)";
	ctx.fillRect(x, y, bw, bh);
	ctx.fillStyle = "#e23b3b";
	ctx.fillRect(x, y, 3, bh);
	ctx.fillStyle = "#eceff3";
	ctx.font = `600 12px "IBM Plex Mono", monospace`;
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("ffmix", x + 14, 33);
	ctx.restore();
}
function drawTicker(ctx, w, h, text, t, p) {
	if (p <= .01) return;
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
	const x = 64 - t * .05 % width;
	ctx.fillText(loop, x, y + 15);
	ctx.fillText(loop, x + width, y + 15);
	ctx.restore();
}
function drawScore(ctx, w, h, home, away, hn, an, p) {
	if (p <= .01) return;
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
	ctx.fillText(home, 26, y + 16);
	ctx.fillText(away, 26, y + 36);
	ctx.font = `600 16px "IBM Plex Mono", monospace`;
	ctx.textAlign = "right";
	ctx.fillText(String(hn), 172, y + 16);
	ctx.fillText(String(an), 172, y + 36);
	ctx.restore();
}
function drawBus(ctx, w, h, which, state, t, tc) {
	ctx.clearRect(0, 0, w, h);
	const job = which === "program" ? state.transitioning : null;
	const activeId = which === "program" ? state.programId : state.previewId;
	const active = inputById(activeId);
	if (job) {
		const from = inputById(job.fromId);
		const to = inputById(job.toId);
		if (from && to) applyTransition(ctx, w, h, job, from, to, t, tc);
		else if (active) drawInput(ctx, active, w, h, t, tc);
	} else if (active) drawInput(ctx, active, w, h, t, tc);
	if (which === "program") {
		const scoreP = gfxAmount(3, t);
		const bugP = gfxAmount(1, t);
		const tickP = gfxAmount(2, t);
		const ltP = gfxAmount(0, t);
		if (scoreP > 0) drawScore(ctx, w, h, state.scoreHome, state.scoreAway, state.scoreHomeN, state.scoreAwayN, scoreP);
		if (bugP > 0) drawBug(ctx, w, h, bugP);
		if (ltP > 0) drawLowerThird(ctx, w, h, state.lowerThirdName, state.lowerThirdTitle, ltP, tickP > .2);
		if (tickP > 0) drawTicker(ctx, w, h, state.ticker, t, tickP);
	}
}
function preloadInputs() {
	for (const src of [
		"/inputs/cam1.jpg",
		"/inputs/cam2.jpg",
		"/inputs/cam3.jpg",
		"/inputs/cam4.jpg",
		"/inputs/media.jpg"
	]) img(src);
}
function MixCanvas({ which, className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		preloadInputs();
		const canvas = ref.current;
		if (!canvas) return;
		if (which === "program") setProgramCanvas(canvas);
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		let raf = 0;
		const loop = () => {
			const dpr = Math.min(1.75, window.devicePixelRatio || 1);
			const rect = canvas.getBoundingClientRect();
			const w = Math.max(2, Math.floor(rect.width * dpr));
			const h = Math.max(2, Math.floor(rect.height * dpr));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
			const s = useMixer.getState();
			s.tick();
			drawBus(ctx, w, h, which, s.snapshot(), Date.now(), formatTc(Date.now() - s.showStartedAt));
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			if (which === "program") setProgramCanvas(null);
		};
	}, [which]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: cn("pointer-events-none block h-full w-full", className)
	});
}
function ytCommand(iframe, func) {
	iframe?.contentWindow?.postMessage(JSON.stringify({
		event: "command",
		func,
		args: []
	}), "*");
}
function YoutubeLayer({ videoId, mute, style, durationMs }) {
	const [node, setNode] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!node) return;
		const apply = () => {
			ytCommand(node, "playVideo");
			ytCommand(node, mute ? "mute" : "unMute");
		};
		apply();
		const t = window.setInterval(apply, 1200);
		const stop = window.setTimeout(() => window.clearInterval(t), 5e3);
		return () => {
			window.clearInterval(t);
			window.clearTimeout(stop);
		};
	}, [
		mute,
		videoId,
		node
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
		ref: setNode,
		title: "YouTube input",
		src: youtubeEmbedSrc(videoId),
		allow: "autoplay; encrypted-media; picture-in-picture",
		referrerPolicy: "strict-origin-when-cross-origin",
		onLoad: () => {
			ytCommand(node, "playVideo");
			ytCommand(node, mute ? "mute" : "unMute");
		},
		className: "pointer-events-none absolute inset-0 h-full w-full border-0",
		style: {
			...style,
			transitionDuration: `${durationMs}ms`,
			transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
		}
	});
}
function layerStyle(which, role, job, armed) {
	if (which !== "program" || !job || role === "solo") return { opacity: 1 };
	const to = role === "to";
	const start = !armed;
	if (job.kind === "fade" || job.kind === "zoom") return {
		opacity: (to ? !start : start) ? 1 : 0,
		transform: job.kind === "zoom" && to ? start ? "scale(1.12)" : "scale(1)" : void 0,
		transitionProperty: "opacity, transform"
	};
	if (job.kind === "wipe") return {
		clipPath: to ? start ? "inset(0 100% 0 0)" : "inset(0 0 0 0)" : start ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
		transitionProperty: "clip-path"
	};
	if (job.kind === "slide") return {
		transform: to ? start ? "translateX(100%)" : "translateX(0%)" : start ? "translateX(0%)" : "translateX(-100%)",
		transitionProperty: "transform"
	};
	return {
		opacity: to ? start ? 0 : 1 : start ? 1 : 0,
		transitionProperty: "opacity"
	};
}
function FeedStage({ which }) {
	const programId = useMixer((s) => s.programId);
	const previewId = useMixer((s) => s.previewId);
	const transitioning = useMixer((s) => s.transitioning);
	const feeds = useMixer((s) => s.feeds);
	const masterMuted = useMixer((s) => s.mutes.master);
	const jobKey = transitioning ? `${transitioning.fromId}:${transitioning.toId}:${transitioning.startedAt}` : "";
	const [armedKey, setArmedKey] = (0, import_react.useState)("");
	const armed = Boolean(jobKey) && armedKey === jobKey;
	(0, import_react.useEffect)(() => {
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
	const fromFeed = job ? feeds[job.fromId] : void 0;
	const toFeed = job ? feeds[job.toId] : void 0;
	const activeFeed = feeds[activeId];
	const durationMs = job?.durationMs ?? 240;
	const layers = [];
	if (job) {
		if (isDomFeed(fromFeed) && fromFeed.youtubeId) layers.push({
			inputId: job.fromId,
			role: "from",
			videoId: fromFeed.youtubeId,
			mute: true
		});
		if (isDomFeed(toFeed) && toFeed.youtubeId) layers.push({
			inputId: job.toId,
			role: "to",
			videoId: toFeed.youtubeId,
			mute: masterMuted
		});
	} else if (isDomFeed(activeFeed) && activeFeed.youtubeId) layers.push({
		inputId: activeId,
		role: "solo",
		videoId: activeFeed.youtubeId,
		mute: which !== "program" || masterMuted
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pointer-events-none absolute inset-0 overflow-hidden bg-bg"),
		children: layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YoutubeLayer, {
			videoId: layer.videoId,
			mute: layer.mute,
			durationMs,
			style: layerStyle(which, layer.role, job, armed)
		}, layer.inputId))
	});
}
function MonitorStack({ which }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedStage, { which }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixCanvas, {
		which,
		className: "absolute inset-0"
	})] });
}
function Monitor({ which, className, pip = false }) {
	const id = useMixer((s) => which === "program" ? s.programId : s.previewId);
	const transitioning = useMixer((s) => s.transitioning);
	const feed = useMixer((s) => s.feeds[id]);
	const cutTo = useMixer((s) => s.cutTo);
	const input = inputById(id);
	const liveMix = which === "program" && Boolean(transitioning);
	const isProgram = which === "program";
	const badge = feedBadge(feed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("flex min-w-0 flex-col gap-1", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden items-baseline justify-between px-0.5 lg:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-[10px] font-semibold tracking-[0.18em]", isProgram ? "text-program" : "text-preview"),
				children: isProgram ? "PROGRAM" : "PREVIEW"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono text-[10px] text-muted",
				children: [
					input ? `${input.num}  ${input.name}` : "—",
					badge ? `  ·  ${badge}` : "",
					feed?.status === "live" ? "  ·  LIVE" : "",
					liveMix ? "  ·  MIX" : ""
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative aspect-video overflow-hidden rounded-md bg-bg shadow-[var(--shadow-border)]", isProgram ? "ring-1 ring-program/70" : "ring-1 ring-preview/50", pip && "shadow-[0_8px_24px_rgba(0,0,0,0.55)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorStack, { which }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-1.5 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em]", isProgram ? "text-program" : "text-preview"),
						children: isProgram ? "PGM" : "PVW"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "max-w-[70%] truncate rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-fg",
						children: [input ? input.name : "—", liveMix ? " MIX" : ""]
					})]
				}),
				pip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-1 lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-preview",
						children: "TAP TAKE"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Take preview to program",
					onClick: () => cutTo(),
					className: "absolute inset-0 lg:hidden"
				})] }) : null
			]
		})]
	});
}
function Monitors() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mixer-monitors relative shrink-0 lg:grid lg:grid-cols-2 lg:gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
			which: "preview",
			pip: true,
			className: "absolute left-1.5 top-1.5 z-10 w-[44%] min-w-28 max-w-48 lg:static lg:w-auto lg:min-w-0 lg:max-w-none"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { which: "program" })]
	});
}
function TopBar({ reverbLabel, peers }) {
	const recording = useMixer((s) => s.recording);
	const streaming = useMixer((s) => s.streaming);
	const recStartedAt = useMixer((s) => s.recStartedAt);
	const streamStartedAt = useMixer((s) => s.streamStartedAt);
	const showStartedAt = useMixer((s) => s.showStartedAt);
	const toggleRecord = useMixer((s) => s.toggleRecord);
	const toggleStream = useMixer((s) => s.toggleStream);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const id = window.setInterval(() => setNow(Date.now()), 250);
		return () => window.clearInterval(id);
	}, []);
	const clock = now ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex shrink-0 items-center gap-1.5 border-b border-border bg-surface px-2 py-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] sm:gap-2 sm:px-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-6 shrink-0 items-center justify-center rounded-sm bg-elevated shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-[1px] bg-program" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs font-semibold tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sm:hidden",
							children: "ffmix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "ffmix-cli"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hidden truncate font-mono text-[10px] text-muted sm:block",
						children: [
							SHOW_NAME,
							"  ·  EP ",
							"014"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-1 hidden min-w-0 shrink-0 font-mono text-[11px] tabular-nums text-fg md:mx-2 md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden text-muted lg:inline",
					children: ["1080p50", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: " / "
					})]
				}), now == null ? "00:00:00:00" : formatTc(clock - showStartedAt)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex min-w-0 items-center gap-1 sm:gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void toggleRecord(),
						"aria-label": recording ? "Stop recording" : "Record",
						className: cn("flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[11px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] sm:px-2.5", recording ? "bg-program text-fg" : "bg-elevated text-muted hover:text-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: cn("size-2.5", recording ? "fill-fg" : "fill-program text-program") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "REC"
							}),
							recording && recStartedAt && now != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatTc(clock - recStartedAt).slice(3, 8)
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: toggleStream,
						"aria-label": streaming ? "Stop stream" : "Go live",
						className: cn("flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md px-2 font-mono text-[11px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] sm:px-2.5", streaming ? "bg-program text-fg" : "bg-elevated text-muted hover:text-fg"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: streaming ? "LIVE" : "STRM"
							}),
							streaming && streamStartedAt && now != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden tabular-nums md:inline",
								children: formatTc(clock - streamStartedAt).slice(3, 8)
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-1.5 rounded-md bg-elevated px-2 py-1.5 font-mono text-[10px] text-muted lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", peers > 0 ? "bg-preview" : "bg-subtle") }),
							"Reverb  ",
							reverbLabel,
							peers > 0 ? `  ·  ${peers}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex shrink-0 rounded-md bg-elevated p-0.5",
						children: [
							{
								to: "/",
								label: "Mix"
							},
							{
								to: "/tally",
								label: "Tal"
							},
							{
								to: "/cli",
								label: "CLI"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-11 items-center rounded-sm px-2.5 font-mono text-[11px] transition-colors duration-150 sm:h-8 sm:px-2.5", pathname === item.to ? "bg-surface text-fg" : "text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: item.to === "/" ? "Mixer" : item.to === "/tally" ? "Tally" : "CLI"
							})]
						}, item.to))
					})
				]
			})
		]
	});
}
//#endregion
export { useReverb as a, cn as i, Monitors as n, TopBar as r, MonitorStack as t };
