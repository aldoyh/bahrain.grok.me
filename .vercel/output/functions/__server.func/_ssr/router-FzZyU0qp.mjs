import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-FzZyU0qp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
var SAMPLE_YOUTUBE = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
var SAMPLE_YOUTUBE_LIVE = "https://www.youtube.com/watch?v=jfKfPfyJRdk";
var SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
var SAMPLE_POSTER = "/inputs/media.jpg";
var YT_ID = /^[A-Za-z0-9_-]{11}$/;
var AUDIO_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac)(\?|$)/i;
function youtubeIdFromUrl(raw) {
	const trimmed = raw.trim();
	if (YT_ID.test(trimmed)) return trimmed;
	let url;
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
function youtubeFeed(url, yt) {
	const live = /\/live(\/|\?|$)/i.test(url) || /[?&]live=1\b/i.test(url);
	return {
		kind: "youtube",
		url: `https://www.youtube.com/watch?v=${yt}`,
		youtubeId: yt,
		label: live ? "YouTube Live" : "YouTube",
		status: "connecting"
	};
}
function audioFeed(url, poster) {
	return {
		kind: "audio",
		url,
		label: "Audio",
		status: "connecting",
		audioOnly: true,
		poster: poster?.trim() || void 0
	};
}
function parseFeedUrl(raw, force = "auto", poster) {
	const url = raw.trim();
	if (!url) return { error: "Paste a YouTube, HLS, RTMP, file, or audio URL" };
	if (force === "audio") {
		try {
			const parsed = new URL(url);
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { error: "Audio needs an https URL" };
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
		if (/^rtmps?:\/\//i.test(url)) return {
			kind: "rtmp",
			url,
			label: "RTMP",
			status: "idle"
		};
		let parsed;
		try {
			parsed = new URL(url);
		} catch {
			return { error: "RTMP needs rtmp:// or an HTTPS playback URL" };
		}
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { error: "RTMP playback must be HLS, FLV, or rtmp://" };
		return {
			kind: "rtmp",
			url,
			playbackUrl: url,
			label: "RTMP",
			status: "connecting"
		};
	}
	if (force === "hls" || force === "flv" || force === "file") {
		try {
			const parsed = new URL(url);
			if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { error: "Use an https URL for this source" };
		} catch {
			return { error: "URL looks invalid" };
		}
		return {
			kind: force,
			url,
			label: force === "flv" ? "HTTP-FLV" : force === "file" ? "File" : "HLS",
			status: "connecting"
		};
	}
	const yt = youtubeIdFromUrl(url);
	if (yt) return youtubeFeed(url, yt);
	if (/^rtmps?:\/\//i.test(url)) return {
		kind: "rtmp",
		url,
		label: "RTMP",
		status: "idle"
	};
	let parsed = null;
	try {
		parsed = new URL(url);
	} catch {
		return { error: "URL looks invalid" };
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { error: "Use https, http, rtmp, or a YouTube link" };
	const path = parsed.pathname.toLowerCase();
	const full = url.toLowerCase();
	if (AUDIO_EXT.test(path) || AUDIO_EXT.test(full)) return audioFeed(url, poster);
	if (path.endsWith(".m3u8") || full.includes(".m3u8")) return {
		kind: "hls",
		url,
		label: "HLS",
		status: "connecting"
	};
	if (path.endsWith(".flv") || full.includes(".flv") || /\/flv(\/|\?|$)/.test(full)) return {
		kind: "flv",
		url,
		label: "HTTP-FLV",
		status: "connecting"
	};
	if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(path)) return {
		kind: "file",
		url,
		label: "File",
		status: "connecting"
	};
	if (/\/(live|hls|hls2|stream)\b/i.test(path)) return {
		kind: "hls",
		url,
		label: "HLS",
		status: "connecting"
	};
	return {
		kind: "hls",
		url,
		label: "Stream",
		status: "connecting",
		poster: poster?.trim() || void 0
	};
}
function withPlayback(feed, playbackUrl, poster) {
	const next = { ...feed };
	if (poster?.trim()) next.poster = poster.trim();
	const play = playbackUrl?.trim();
	if (!play) return next;
	if (feed.kind !== "rtmp") return next;
	return {
		...next,
		playbackUrl: play,
		status: "connecting",
		error: void 0
	};
}
function playableUrl(feed) {
	if (feed.kind === "youtube") return null;
	if (feed.kind === "rtmp") return feed.playbackUrl?.trim() || null;
	return feed.url;
}
function playbackKind(feed) {
	if (feed.kind === "audio" || feed.audioOnly) return "audio";
	const url = playableUrl(feed);
	if (!url) return feed.kind === "youtube" ? "youtube" : null;
	const parsed = parseFeedUrl(url);
	if ("error" in parsed) return feed.kind === "rtmp" ? "hls" : feed.kind;
	if (parsed.kind === "rtmp" || parsed.kind === "youtube") return "hls";
	return parsed.kind;
}
function isDomFeed(feed) {
	return Boolean(feed && feed.kind === "youtube" && feed.youtubeId);
}
function youtubeEmbedSrc(id) {
	return `https://www.youtube-nocookie.com/embed/${id}?${new URLSearchParams({
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
		origin: typeof window !== "undefined" ? window.location.origin : ""
	}).toString()}`;
}
function mixProgress(startedAt, durationMs, now = Date.now()) {
	const raw = Math.min(1, Math.max(0, (now - startedAt) / Math.max(1, durationMs)));
	return raw * raw * (3 - 2 * raw);
}
function feedBadge(feed) {
	if (!feed) return null;
	if (feed.status === "error") return "ERR";
	if (feed.kind === "audio" || feed.audioOnly) return "AUD";
	if (feed.kind === "rtmp" && !feed.playbackUrl) return "RTMP";
	return feed.label;
}
function isAudioFeed(feed) {
	return Boolean(feed && (feed.kind === "audio" || feed.audioOnly));
}
var videos = /* @__PURE__ */ new Map();
var hlsPlayers = /* @__PURE__ */ new Map();
var flvPlayers = /* @__PURE__ */ new Map();
var attachGen = /* @__PURE__ */ new Map();
function getFeedVideo(id) {
	return videos.get(id) ?? null;
}
function destroy(id) {
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
		} catch {}
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
function ensureVideo(id) {
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
	video.style.cssText = "position:fixed;left:-9999px;top:0;width:4px;height:4px;opacity:0;pointer-events:none";
	document.body.appendChild(video);
	videos.set(id, video);
	return video;
}
function detachFeed(id) {
	attachGen.set(id, (attachGen.get(id) ?? 0) + 1);
	destroy(id);
}
function attachFeed(id, feed, onStatus) {
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
	(async () => {
		try {
			if (kind === "audio") {
				video.src = url;
				video.play().catch(() => {
					if (alive()) onStatus("error", "Autoplay blocked");
				});
				return;
			}
			if (kind === "hls") {
				const { default: Hls } = await import("../_libs/hls.js.mjs").then((n) => n.t);
				if (!alive()) return;
				if (Hls.isSupported()) {
					const hls = new Hls({
						enableWorker: true,
						lowLatencyMode: true,
						backBufferLength: 30
					});
					hlsPlayers.set(id, hls);
					hls.loadSource(url);
					hls.attachMedia(video);
					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						if (!alive()) return;
						video.play().catch(() => onStatus("error", "Autoplay blocked"));
					});
					hls.on(Hls.Events.ERROR, (_e, data) => {
						if (data.fatal && alive()) onStatus("error", data.details || "HLS error");
					});
					return;
				}
				if (video.canPlayType("application/vnd.apple.mpegurl")) {
					video.src = url;
					video.play().catch(() => {
						if (alive()) onStatus("error", "Autoplay blocked");
					});
					return;
				}
				onStatus("error", "HLS not supported");
				return;
			}
			if (kind === "flv") {
				const mpegts = (await import("../_libs/mpegts.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
				if (!alive()) return;
				if (!mpegts.isSupported()) {
					onStatus("error", "FLV not supported");
					return;
				}
				const player = mpegts.createPlayer({
					type: "flv",
					url,
					isLive: true,
					hasAudio: true,
					hasVideo: true,
					cors: true
				}, {
					enableWorker: true,
					liveBufferLatencyChasing: true
				});
				flvPlayers.set(id, player);
				player.attachMediaElement(video);
				player.load();
				player.play();
				player.on(mpegts.Events.ERROR, (...args) => {
					if (alive()) onStatus("error", String(args[1] || "FLV error"));
				});
				return;
			}
			video.src = url;
			video.play().catch(() => {
				if (alive()) onStatus("error", "Autoplay blocked");
			});
		} catch (err) {
			if (alive()) onStatus("error", err instanceof Error ? err.message : "Attach failed");
		}
	})();
}
function syncFeedMute(programId, masterMuted) {
	for (const [id, video] of videos) video.muted = id !== programId || masterMuted;
}
function destroyAllFeeds() {
	for (const id of [...videos.keys()]) detachFeed(id);
}
var SHOW_NAME = "Night Desk";
var INPUTS = [
	{
		id: "cam1",
		num: 1,
		name: "CAM 1",
		label: "Studio A",
		kind: "camera",
		src: "/inputs/cam1.jpg",
		bus: "cam1"
	},
	{
		id: "cam2",
		num: 2,
		name: "CAM 2",
		label: "Wide",
		kind: "camera",
		src: "/inputs/cam2.jpg",
		bus: "cam2"
	},
	{
		id: "cam3",
		num: 3,
		name: "CAM 3",
		label: "City",
		kind: "camera",
		src: "/inputs/cam3.jpg",
		bus: "media"
	},
	{
		id: "cam4",
		num: 4,
		name: "CAM 4",
		label: "Pitch",
		kind: "camera",
		src: "/inputs/cam4.jpg",
		bus: "cam4"
	},
	{
		id: "media",
		num: 5,
		name: "MEDIA",
		label: "Bumper",
		kind: "media",
		src: "/inputs/media.jpg",
		bus: "media"
	},
	{
		id: "bars",
		num: 6,
		name: "BARS",
		label: "SMPTE",
		kind: "bars",
		bus: "media"
	},
	{
		id: "clock",
		num: 7,
		name: "CLOCK",
		label: "Manama",
		kind: "clock",
		bus: "media"
	},
	{
		id: "slate",
		num: 8,
		name: "SLATE",
		label: "Ident",
		kind: "slate",
		bus: "media"
	},
	{
		id: "title",
		num: 9,
		name: "TITLE",
		label: "Open",
		kind: "title",
		bus: "media"
	},
	{
		id: "webcam",
		num: 0,
		name: "CAM 0",
		label: "Local",
		kind: "webcam",
		bus: "cam1"
	}
];
var SCENES = [
	{
		id: "open",
		name: "Open",
		previewId: "cam2",
		overlays: [
			false,
			true,
			false,
			false
		]
	},
	{
		id: "talk",
		name: "Talk",
		previewId: "cam1",
		overlays: [
			true,
			true,
			false,
			false
		]
	},
	{
		id: "pkg",
		name: "Package",
		previewId: "cam3",
		overlays: [
			false,
			true,
			true,
			false
		]
	},
	{
		id: "sports",
		name: "Sports",
		previewId: "cam4",
		overlays: [
			false,
			true,
			false,
			true
		]
	},
	{
		id: "close",
		name: "Close",
		previewId: "title",
		overlays: [
			false,
			true,
			false,
			false
		]
	}
];
var AUDIO_BUSES = [
	{
		id: "cam1",
		label: "CAM 1"
	},
	{
		id: "cam2",
		label: "CAM 2"
	},
	{
		id: "cam4",
		label: "CAM 4"
	},
	{
		id: "media",
		label: "MEDIA"
	},
	{
		id: "master",
		label: "MST"
	}
];
var OVERLAYS = [
	{
		i: 0,
		label: "LT",
		hint: "Lower third",
		inMs: 420,
		outMs: 280
	},
	{
		i: 1,
		label: "Bug",
		hint: "Corner ident",
		inMs: 280,
		outMs: 180
	},
	{
		i: 2,
		label: "Tick",
		hint: "Crawl",
		inMs: 320,
		outMs: 220
	},
	{
		i: 3,
		label: "Score",
		hint: "Score bug",
		inMs: 360,
		outMs: 240
	}
];
var GFX_SAMPLES = [
	{
		id: "talk",
		name: "Talk",
		hint: "LT slides in  ·  bug fades",
		lowerThirdName: "Hasan AlDoy",
		lowerThirdTitle: "Studio Host  ·  Night Desk",
		overlays: [
			true,
			true,
			false,
			false
		]
	},
	{
		id: "break",
		name: "Breaking",
		hint: "Name plate  ·  LIVE crawl",
		lowerThirdName: "BREAKING",
		lowerThirdTitle: "Manama  ·  developing",
		ticker: "BREAKING  ·  NIGHT DESK  ·  MANAMA  ·  LIVE DESK  ·  MORE TO FOLLOW  ·  STAY WITH US",
		overlays: [
			true,
			true,
			true,
			false
		]
	},
	{
		id: "pkg",
		name: "Package",
		hint: "Bug holds  ·  ticker rises",
		ticker: "NIGHT DESK  ·  EP 014  ·  CITY PACKAGE  ·  CAM 3  ·  MANAMA",
		overlays: [
			false,
			true,
			true,
			false
		]
	},
	{
		id: "sports",
		name: "Sports",
		hint: "Score drops in  ·  bug",
		scoreHome: "MHR",
		scoreAway: "RIF",
		scoreHomeN: 2,
		scoreAwayN: 1,
		overlays: [
			false,
			true,
			false,
			true
		]
	},
	{
		id: "ident",
		name: "Ident",
		hint: "Name plate in  ·  all else out",
		lowerThirdName: "Night Desk",
		lowerThirdTitle: "Episode 014  ·  Manama",
		overlays: [
			true,
			false,
			false,
			false
		]
	},
	{
		id: "clear",
		name: "Out all",
		hint: "Staggered exits",
		overlays: [
			false,
			false,
			false,
			false
		]
	}
];
function inputById(id) {
	return INPUTS.find((i) => i.id === id);
}
function inputByNum(n) {
	return INPUTS.find((i) => i.num === n);
}
var webcamVideo = null;
var programCanvas = null;
function setWebcamVideo(el) {
	webcamVideo = el;
}
function getWebcamVideo() {
	return webcamVideo;
}
function setProgramCanvas(el) {
	programCanvas = el;
}
function getProgramCanvas() {
	return programCanvas;
}
var BUS_IDS = [
	"cam1",
	"cam2",
	"cam4",
	"media",
	"master"
];
var ctx = null;
var master = null;
var masterAnalyser = null;
var dest = null;
var buses = /* @__PURE__ */ new Map();
var meterBuf = /* @__PURE__ */ new Uint8Array(64);
var presenceBus = null;
function brownNoise(ac, seconds = 2) {
	const length = ac.sampleRate * seconds;
	const buffer = ac.createBuffer(1, length, ac.sampleRate);
	const data = buffer.getChannelData(0);
	let last = 0;
	for (let i = 0; i < length; i++) {
		const white = Math.random() * 2 - 1;
		last = (last + .02 * white) / 1.02;
		data[i] = last * 3.5;
	}
	return buffer;
}
async function startAudio(gains, mutes) {
	if (ctx) return;
	const ac = new AudioContext();
	if (ac.state === "suspended") await ac.resume();
	const noise = brownNoise(ac);
	const m = ac.createGain();
	m.gain.value = mutes.master ? 0 : gains.master;
	const analyser = ac.createAnalyser();
	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = .7;
	const compressor = ac.createDynamicsCompressor();
	compressor.threshold.value = -18;
	compressor.ratio.value = 3;
	const out = ac.createMediaStreamDestination();
	m.connect(compressor);
	compressor.connect(analyser);
	analyser.connect(ac.destination);
	analyser.connect(out);
	for (const id of BUS_IDS) {
		if (id === "master") continue;
		const src = ac.createBufferSource();
		src.buffer = noise;
		src.loop = true;
		const filter = ac.createBiquadFilter();
		filter.type = id === "media" ? "lowpass" : "highpass";
		filter.frequency.value = id === "media" ? 420 : 180;
		const g = ac.createGain();
		g.gain.value = mutes[id] ? 0 : gains[id] * .18;
		const a = ac.createAnalyser();
		a.fftSize = 256;
		a.smoothingTimeConstant = .65;
		src.connect(filter);
		filter.connect(g);
		g.connect(a);
		a.connect(m);
		src.start();
		buses.set(id, {
			gain: g,
			analyser: a,
			filter,
			source: src
		});
	}
	ctx = ac;
	master = m;
	masterAnalyser = analyser;
	dest = out;
}
function setBusGain(bus, gain) {
	if (bus === "master") {
		if (master) master.gain.setTargetAtTime(gain, ctx?.currentTime ?? 0, .05);
		return;
	}
	const node = buses.get(bus);
	if (!node || !ctx) return;
	const presence = presenceBus === bus ? 1 : .45;
	node.gain.gain.setTargetAtTime(gain * .18 * presence, ctx.currentTime, .08);
}
function setBusMute(bus, muted) {
	if (bus === "master") {
		if (master) master.gain.setTargetAtTime(muted ? 0 : .8, ctx?.currentTime ?? 0, .04);
		return;
	}
	const node = buses.get(bus);
	if (!node || !ctx) return;
	node.gain.gain.setTargetAtTime(muted ? 0 : .12, ctx.currentTime, .04);
}
function setPresence(bus) {
	presenceBus = bus;
}
function getMasterDest() {
	return dest;
}
function rms(analyser) {
	analyser.getByteTimeDomainData(meterBuf);
	let sum = 0;
	for (let i = 0; i < meterBuf.length; i++) {
		const v = (meterBuf[i] - 128) / 128;
		sum += v * v;
	}
	return Math.sqrt(sum / meterBuf.length);
}
function readMeters() {
	const out = {
		cam1: 0,
		cam2: 0,
		cam4: 0,
		media: 0,
		master: 0
	};
	if (!ctx) return out;
	for (const id of BUS_IDS) {
		if (id === "master") {
			out.master = masterAnalyser ? Math.min(1, rms(masterAnalyser) * 4.2) : 0;
			continue;
		}
		const node = buses.get(id);
		out[id] = node ? Math.min(1, rms(node.analyser) * 5.5) : 0;
	}
	return out;
}
var logSeq = 1;
var recChunks = [];
var recorder = null;
var recorderMime = "video/webm";
var defaultGains = {
	cam1: .72,
	cam2: .4,
	cam4: .55,
	media: .35,
	master: .8
};
var defaultMutes = {
	cam1: false,
	cam2: false,
	cam4: false,
	media: false,
	master: false
};
function snapshotOf(s) {
	return {
		programId: s.programId,
		previewId: s.previewId,
		overlays: s.overlays,
		recording: s.recording,
		streaming: s.streaming,
		transition: s.transition,
		durationMs: s.durationMs,
		transitioning: s.transitioning,
		recStartedAt: s.recStartedAt,
		streamStartedAt: s.streamStartedAt,
		lowerThirdName: s.lowerThirdName,
		lowerThirdTitle: s.lowerThirdTitle,
		ticker: s.ticker,
		scoreHome: s.scoreHome,
		scoreAway: s.scoreAway,
		scoreHomeN: s.scoreHomeN,
		scoreAwayN: s.scoreAwayN,
		feeds: s.feeds
	};
}
function pushLog(logs, level, msg) {
	return [...logs.slice(-79), {
		id: logSeq++,
		t: Date.now(),
		level,
		msg
	}];
}
function beginTransition(s, kind) {
	const fromId = s.programId;
	const toId = s.previewId;
	const from = inputById(fromId);
	const to = inputById(toId);
	if (fromId === toId) return { logs: pushLog(s.logs, "warn", "Preview and program are the same input") };
	if (kind === "cut" || s.durationMs < 40) return {
		programId: toId,
		previewId: fromId,
		transitioning: null,
		logs: pushLog(s.logs, "ok", `Cut  ${from?.name ?? fromId} → ${to?.name ?? toId}  PGM`)
	};
	return {
		programId: toId,
		previewId: fromId,
		transitioning: {
			fromId,
			toId,
			kind,
			startedAt: Date.now(),
			durationMs: s.durationMs
		},
		logs: pushLog(s.logs, "ok", `${kind[0].toUpperCase()}${kind.slice(1)}  ${s.durationMs}ms  ${from?.name} → ${to?.name}`)
	};
}
var useMixer = create()(persist((set, get) => ({
	programId: "cam1",
	previewId: "cam2",
	overlays: [
		false,
		true,
		false,
		false
	],
	overlayAt: [
		0,
		0,
		0,
		0
	],
	overlayOut: [
		false,
		false,
		false,
		false
	],
	recording: false,
	streaming: false,
	transition: "fade",
	durationMs: 700,
	transitioning: null,
	recStartedAt: null,
	streamStartedAt: null,
	showStartedAt: Date.now(),
	lowerThirdName: "Hasan AlDoy",
	lowerThirdTitle: "Studio Host",
	ticker: "ffmix-cli  ·  NIGHT DESK  ·  MANAMA  ·  LIVE PRODUCTION  ·  CUT  FADE  WIPE  SLIDE",
	scoreHome: "HOME",
	scoreAway: "AWAY",
	scoreHomeN: 2,
	scoreAwayN: 1,
	gains: { ...defaultGains },
	mutes: { ...defaultMutes },
	logs: [{
		id: logSeq++,
		t: Date.now(),
		level: "info",
		msg: "ffmix-cli 1.0.0  ·  Laravel Zero TUI  ·  type help"
	}],
	audioArmed: false,
	webcamReady: false,
	lastDownload: null,
	feeds: {},
	setPreview: (id) => {
		const input = inputById(id);
		if (!input) return;
		set((s) => ({
			previewId: id,
			logs: pushLog(s.logs, "info", `Preview  ${input.name}  ${input.label}`)
		}));
		const s = get();
		syncFeedMute(s.programId, s.mutes.master);
	},
	cutTo: (id) => {
		if (id) {
			if (!inputById(id)) return;
			set((s) => ({
				previewId: id,
				...beginTransition({
					...s,
					previewId: id
				}, "cut")
			}));
			const s = get();
			syncFeedMute(s.programId, s.mutes.master);
			return;
		}
		set((s) => beginTransition(s, "cut"));
		const s = get();
		syncFeedMute(s.programId, s.mutes.master);
	},
	auto: () => {
		set((s) => beginTransition(s, s.transition));
		const s = get();
		syncFeedMute(s.programId, s.mutes.master);
	},
	setTransition: (kind) => set({ transition: kind }),
	setDuration: (ms) => set({ durationMs: Math.round(ms) }),
	toggleOverlay: (index, on) => {
		set((s) => {
			const want = on ?? !(s.overlays[index] && !s.overlayOut[index]);
			const overlays = [...s.overlays];
			const overlayAt = [...s.overlayAt];
			const overlayOut = [...s.overlayOut];
			const now = Date.now();
			const names = OVERLAYS.map((o) => o.label);
			if (want) {
				overlays[index] = true;
				overlayOut[index] = false;
				overlayAt[index] = now;
			} else if (overlays[index]) {
				overlayOut[index] = true;
				overlayAt[index] = now;
			}
			return {
				overlays,
				overlayAt,
				overlayOut,
				logs: pushLog(s.logs, want ? "ok" : "warn", `Overlay ${index + 1}  ${names[index]}  ${want ? "IN" : "OUT"}`)
			};
		});
	},
	applyGfxSample: (id) => {
		const sample = GFX_SAMPLES.find((g) => g.id === id);
		if (!sample) return;
		set((s) => {
			const overlays = [...s.overlays];
			const overlayAt = [...s.overlayAt];
			const overlayOut = [...s.overlayOut];
			const now = Date.now();
			for (let i = 0; i < 4; i++) {
				const want = sample.overlays[i];
				const isOn = overlays[i] && !overlayOut[i];
				if (want && !isOn) {
					overlays[i] = true;
					overlayOut[i] = false;
					overlayAt[i] = now + i * 80;
				} else if (!want && isOn) {
					overlayOut[i] = true;
					overlayAt[i] = now + i * 50;
				}
			}
			return {
				overlays,
				overlayAt,
				overlayOut,
				lowerThirdName: sample.lowerThirdName ?? s.lowerThirdName,
				lowerThirdTitle: sample.lowerThirdTitle ?? s.lowerThirdTitle,
				ticker: sample.ticker ?? s.ticker,
				scoreHome: sample.scoreHome ?? s.scoreHome,
				scoreAway: sample.scoreAway ?? s.scoreAway,
				scoreHomeN: sample.scoreHomeN ?? s.scoreHomeN,
				scoreAwayN: sample.scoreAwayN ?? s.scoreAwayN,
				logs: pushLog(s.logs, "ok", `GFX  ${sample.name}  ·  ${sample.hint}`)
			};
		});
	},
	applyScene: (id, take) => {
		const scene = SCENES.find((x) => x.id === id);
		if (!scene) return;
		set((s) => {
			const overlays = [...s.overlays];
			const overlayAt = [...s.overlayAt];
			const overlayOut = [...s.overlayOut];
			const now = Date.now();
			for (let i = 0; i < 4; i++) {
				const want = scene.overlays[i];
				const isOn = overlays[i] && !overlayOut[i];
				if (want && !isOn) {
					overlays[i] = true;
					overlayOut[i] = false;
					overlayAt[i] = now + i * 80;
				} else if (!want && isOn) {
					overlayOut[i] = true;
					overlayAt[i] = now + i * 50;
				}
			}
			const next = {
				...s,
				previewId: scene.previewId,
				overlays,
				overlayAt,
				overlayOut,
				logs: pushLog(s.logs, "info", `Scene  ${scene.name}`)
			};
			if (take) return {
				...next,
				...beginTransition(next, s.transition)
			};
			return {
				previewId: next.previewId,
				overlays: next.overlays,
				overlayAt: next.overlayAt,
				overlayOut: next.overlayOut,
				logs: next.logs
			};
		});
	},
	setGain: (bus, gain) => {
		const g = Math.min(1, Math.max(0, gain));
		set((s) => ({ gains: {
			...s.gains,
			[bus]: g
		} }));
		setBusGain(bus, g);
	},
	toggleMute: (bus) => {
		set((s) => {
			const muted = !s.mutes[bus];
			setBusMute(bus, muted);
			if (bus === "master") syncFeedMute(s.programId, muted);
			return {
				mutes: {
					...s.mutes,
					[bus]: muted
				},
				logs: pushLog(s.logs, muted ? "warn" : "ok", `${bus.toUpperCase()}  ${muted ? "MUTE" : "ON"}`)
			};
		});
	},
	setLowerThird: (name, title) => set({
		lowerThirdName: name,
		lowerThirdTitle: title
	}),
	setTicker: (text) => set({ ticker: text }),
	setScore: (partial) => set(partial),
	log: (level, msg) => set((s) => ({ logs: pushLog(s.logs, level, msg) })),
	tick: () => {
		const s = get();
		const now = Date.now();
		let overlays = s.overlays;
		let overlayOut = s.overlayOut;
		let gfxChanged = false;
		for (let i = 0; i < 4; i++) {
			if (!overlayOut[i] || !overlays[i]) continue;
			if (now - s.overlayAt[i] < OVERLAYS[i].outMs) continue;
			if (!gfxChanged) {
				overlays = [...overlays];
				overlayOut = [...overlayOut];
				gfxChanged = true;
			}
			overlays[i] = false;
			overlayOut[i] = false;
		}
		const job = s.transitioning;
		const transDone = Boolean(job && now >= job.startedAt + job.durationMs);
		if (!gfxChanged && !transDone) return;
		set({
			...gfxChanged ? {
				overlays,
				overlayOut
			} : {},
			...transDone ? { transitioning: null } : {}
		});
	},
	armAudio: async () => {
		if (get().audioArmed) return;
		const s = get();
		await startAudio(s.gains, s.mutes);
		set({ audioArmed: true });
		get().log("ok", "Audio engine armed");
	},
	armWebcam: async () => {
		if (get().webcamReady) {
			get().setPreview("webcam");
			return;
		}
		if (!navigator.mediaDevices?.getUserMedia) {
			get().log("error", "Camera API not available");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			});
			const video = document.createElement("video");
			video.srcObject = stream;
			video.muted = true;
			video.playsInline = true;
			await video.play();
			setWebcamVideo(video);
			set({
				webcamReady: true,
				previewId: "webcam"
			});
			get().log("ok", "CAM 0  Local camera online");
		} catch {
			get().log("error", "Camera permission denied");
		}
	},
	toggleRecord: async () => {
		if (get().recording) {
			const rec = recorder;
			recorder = null;
			if (rec && rec.state !== "inactive") rec.stop();
			set({ recording: false });
			get().log("warn", "Record stop");
			return;
		}
		const canvas = getProgramCanvas();
		if (!canvas) {
			get().log("error", "Program canvas not ready");
			return;
		}
		try {
			const vStream = canvas.captureStream(30);
			const dest = getMasterDest();
			const tracks = [...vStream.getVideoTracks(), ...dest ? dest.stream.getAudioTracks() : []];
			const mixed = new MediaStream(tracks);
			const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "";
			recChunks = [];
			recorderMime = mime || "video/webm";
			recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : void 0);
			recorder.ondataavailable = (e) => {
				if (e.data.size) recChunks.push(e.data);
			};
			recorder.onstop = () => {
				const blob = new Blob(recChunks, { type: recorderMime });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `ffmix-${Date.now()}.webm`;
				a.click();
				set({
					lastDownload: url,
					recStartedAt: null
				});
			};
			recorder.start(400);
			set({
				recording: true,
				recStartedAt: Date.now()
			});
			get().log("ok", "Record start  ·  Program bus");
		} catch {
			get().log("error", "Recorder unavailable");
		}
	},
	toggleStream: () => {
		if (get().streaming) {
			set({
				streaming: false,
				streamStartedAt: null
			});
			get().log("warn", "Stream stop  ·  Reverb ingest closed");
			return;
		}
		set({
			streaming: true,
			streamStartedAt: Date.now()
		});
		get().log("ok", "Stream start  ·  reverb://mixer.program");
	},
	hydrate: (snap) => {
		set({
			programId: snap.programId,
			previewId: snap.previewId,
			overlays: snap.overlays,
			recording: snap.recording,
			streaming: snap.streaming,
			transition: snap.transition === "cut" ? get().transition : snap.transition,
			durationMs: snap.durationMs,
			transitioning: snap.transitioning,
			recStartedAt: snap.recStartedAt,
			streamStartedAt: snap.streamStartedAt,
			lowerThirdName: snap.lowerThirdName,
			lowerThirdTitle: snap.lowerThirdTitle,
			ticker: snap.ticker,
			scoreHome: snap.scoreHome,
			scoreAway: snap.scoreAway,
			scoreHomeN: snap.scoreHomeN,
			scoreAwayN: snap.scoreAwayN,
			feeds: snap.feeds ?? get().feeds
		});
	},
	snapshot: () => snapshotOf(get()),
	setFeed: (inputId, feed) => {
		const input = inputById(inputId);
		if (!input) return;
		set((s) => ({
			feeds: {
				...s.feeds,
				[inputId]: {
					...feed,
					status: feed.status ?? "connecting"
				}
			},
			logs: pushLog(s.logs, "ok", `${input.name}  source  ${feed.label}  ${feed.youtubeId ?? feed.url}`)
		}));
		const s = get();
		syncFeedMute(s.programId, s.mutes.master);
	},
	clearFeed: (inputId) => {
		const input = inputById(inputId);
		set((s) => {
			const next = { ...s.feeds };
			delete next[inputId];
			return {
				feeds: next,
				logs: pushLog(s.logs, "warn", `${input?.name ?? inputId}  source cleared`)
			};
		});
	},
	setFeedStatus: (inputId, status, error) => {
		set((s) => {
			const current = s.feeds[inputId];
			if (!current) return {};
			if (current.status === status && current.error === error) return {};
			return { feeds: {
				...s.feeds,
				[inputId]: {
					...current,
					status,
					error
				}
			} };
		});
	},
	setFeedPlayback: (inputId, playbackUrl) => {
		const current = get().feeds[inputId];
		if (!current) return;
		set((s) => ({
			feeds: {
				...s.feeds,
				[inputId]: {
					...current,
					playbackUrl: playbackUrl.trim(),
					status: "connecting",
					error: void 0
				}
			},
			logs: pushLog(s.logs, "ok", `${inputById(inputId)?.name ?? inputId}  RTMP playback set`)
		}));
	}
}), {
	name: "ffmix-cli",
	skipHydration: true,
	partialize: (s) => ({
		lowerThirdName: s.lowerThirdName,
		lowerThirdTitle: s.lowerThirdTitle,
		ticker: s.ticker,
		scoreHome: s.scoreHome,
		scoreAway: s.scoreAway,
		scoreHomeN: s.scoreHomeN,
		scoreAwayN: s.scoreAwayN,
		durationMs: s.durationMs,
		transition: s.transition,
		gains: s.gains,
		feeds: s.feeds
	})
}));
function signature(feed) {
	return `${feed.kind}|${feed.url}|${feed.playbackUrl ?? ""}`;
}
function FeedEngine() {
	const feeds = useMixer((s) => s.feeds);
	const programId = useMixer((s) => s.programId);
	const masterMuted = useMixer((s) => s.mutes.master);
	const attached = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	(0, import_react.useEffect)(() => {
		const wanted = new Set(Object.keys(feeds));
		for (const [id, sig] of attached.current) if (!wanted.has(id) || signature(feeds[id]) !== sig) {
			detachFeed(id);
			attached.current.delete(id);
		}
		for (const [id, feed] of Object.entries(feeds)) {
			const sig = signature(feed);
			if (attached.current.get(id) === sig) continue;
			attached.current.set(id, sig);
			attachFeed(id, feed, (status, error) => useMixer.getState().setFeedStatus(id, status, error));
		}
	}, [feeds]);
	(0, import_react.useEffect)(() => {
		syncFeedMute(programId, masterMuted);
	}, [
		programId,
		masterMuted,
		feeds
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			destroyAllFeeds();
			attached.current.clear();
		};
	}, []);
	return null;
}
function useMixerPersist() {
	(0, import_react.useEffect)(() => {
		useMixer.persist.rehydrate();
	}, []);
}
var styles_default = "/assets/styles-BoBQzvyt.css";
var APP_NAME = "ffmix-cli";
function MixerBoot() {
	useMixerPersist();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedEngine, {});
}
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#08090b"
			},
			{
				name: "description",
				content: "Live production mixer — vMix-style Preview/Program, Laravel Prompts TUI, Reverb tally."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixerBoot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-B-RCTWp_.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./cli-CaGFa78c.mjs");
var Route$1 = createFileRoute("/cli")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tally-DIRuuYjT.mjs");
var Route = createFileRoute("/tally")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	CliRoute: Route$1.update({
		id: "/cli",
		path: "/cli",
		getParentRoute: () => Route$3
	}),
	TallyRoute: Route.update({
		id: "/tally",
		path: "/tally",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { isDomFeed as C, youtubeEmbedSrc as D, withPlayback as E, isAudioFeed as S, parseFeedUrl as T, SAMPLE_HLS as _, getWebcamVideo as a, SAMPLE_YOUTUBE_LIVE as b, GFX_SAMPLES as c, SCENES as d, SHOW_NAME as f, SAMPLE_AUDIO as g, getFeedVideo as h, setPresence as i, INPUTS as l, inputByNum as m, useMixer as n, setProgramCanvas as o, inputById as p, readMeters as r, AUDIO_BUSES as s, router_exports as t, OVERLAYS as u, SAMPLE_POSTER as v, mixProgress as w, feedBadge as x, SAMPLE_YOUTUBE as y };
