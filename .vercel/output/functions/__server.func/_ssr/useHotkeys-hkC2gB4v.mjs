import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as withPlayback, T as parseFeedUrl, d as SCENES, l as INPUTS, m as inputByNum, n as useMixer, p as inputById } from "./router-FzZyU0qp.mjs";
import { i as cn } from "./TopBar-CugN3m1-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useHotkeys-hkC2gB4v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMANDS = [
	{
		name: "take",
		usage: "take",
		hint: "Cut preview to program",
		aliases: ["cut"]
	},
	{
		name: "auto",
		usage: "auto",
		hint: "Run selected transition",
		aliases: ["go"]
	},
	{
		name: "fade",
		usage: "fade [ms]",
		hint: "Crossfade to preview"
	},
	{
		name: "wipe",
		usage: "wipe [ms]",
		hint: "Wipe to preview"
	},
	{
		name: "slide",
		usage: "slide [ms]",
		hint: "Slide to preview"
	},
	{
		name: "zoom",
		usage: "zoom [ms]",
		hint: "Zoom to preview"
	},
	{
		name: "preview",
		usage: "preview <n|name>",
		hint: "Send input to preview",
		aliases: ["pvw"]
	},
	{
		name: "program",
		usage: "program <n|name>",
		hint: "Cut input to program",
		aliases: ["pgm"]
	},
	{
		name: "source",
		usage: "source <n> <url|yt|live|hls|clear>",
		hint: "Assign YouTube / HLS / RTMP",
		aliases: ["src"]
	},
	{
		name: "overlay",
		usage: "overlay <1-4> [on|off]",
		hint: "Toggle overlay channel",
		aliases: ["ov"]
	},
	{
		name: "scene",
		usage: "scene <name>",
		hint: "Load OBS-style scene"
	},
	{
		name: "mute",
		usage: "mute <bus>",
		hint: "Mute an audio bus"
	},
	{
		name: "unmute",
		usage: "unmute <bus>",
		hint: "Unmute an audio bus"
	},
	{
		name: "gain",
		usage: "gain <bus> <0-100>",
		hint: "Set bus fader"
	},
	{
		name: "record",
		usage: "record [start|stop]",
		hint: "Arm Program recorder",
		aliases: ["rec"]
	},
	{
		name: "stream",
		usage: "stream [start|stop]",
		hint: "Toggle Reverb ingest",
		aliases: ["live"]
	},
	{
		name: "audio",
		usage: "audio",
		hint: "Arm studio audio"
	},
	{
		name: "cam",
		usage: "cam",
		hint: "Enable local camera"
	},
	{
		name: "inputs",
		usage: "inputs",
		hint: "List inputs"
	},
	{
		name: "status",
		usage: "status",
		hint: "Show mixer status"
	},
	{
		name: "help",
		usage: "help",
		hint: "List commands",
		aliases: ["?"]
	},
	{
		name: "clear",
		usage: "clear",
		hint: "Clear TUI log"
	}
];
var aliasMap = /* @__PURE__ */ new Map();
for (const c of COMMANDS) {
	aliasMap.set(c.name, c.name);
	for (const a of c.aliases ?? []) aliasMap.set(a, c.name);
}
function suggestCommands(q) {
	const s = q.trim().toLowerCase();
	if (!s) return COMMANDS;
	return COMMANDS.filter((c) => c.name.startsWith(s) || c.usage.startsWith(s) || (c.aliases ?? []).some((a) => a.startsWith(s)));
}
function resolveInput(token) {
	if (!token) return void 0;
	if (/^\d+$/.test(token)) return inputByNum(Number(token));
	const lower = token.toLowerCase();
	return inputById(lower) || INPUTS.find((i) => i.name.toLowerCase() === lower || i.name.toLowerCase().replace(/\s+/g, "") === lower || i.label.toLowerCase() === lower || i.id === lower);
}
function resolveBus(token) {
	if (!token) return void 0;
	return {
		cam1: "cam1",
		cam2: "cam2",
		cam4: "cam4",
		media: "media",
		master: "master",
		mst: "master",
		"1": "cam1",
		"2": "cam2",
		"4": "cam4",
		"5": "media"
	}[token.toLowerCase()];
}
function applyDuration(ms) {
	if (!ms) return;
	const n = Number(ms);
	if (Number.isFinite(n) && n >= 40 && n <= 5e3) useMixer.getState().setDuration(n);
}
function runCommand(line) {
	const raw = line.trim();
	if (!raw) return null;
	const tokens = raw.split(/\s+/);
	const head = tokens[0].toLowerCase();
	const cmd = aliasMap.get(head);
	const mixer = useMixer.getState();
	if (!cmd) {
		mixer.log("error", `Unknown command  ${head}`);
		return `Unknown command '${head}'. Try help.`;
	}
	switch (cmd) {
		case "take":
			mixer.cutTo();
			return null;
		case "auto":
			mixer.auto();
			return null;
		case "fade":
		case "wipe":
		case "slide":
		case "zoom":
			applyDuration(tokens[1]);
			mixer.setTransition(cmd);
			mixer.auto();
			return null;
		case "preview": {
			const input = resolveInput(tokens[1]);
			if (!input) {
				mixer.log("error", "preview needs an input (1-9,0 or name)");
				return "Usage: preview <n|name>";
			}
			if (input.kind === "webcam" && !mixer.webcamReady) {
				mixer.armWebcam();
				return "Arming local camera…";
			}
			mixer.setPreview(input.id);
			return null;
		}
		case "program": {
			const input = resolveInput(tokens[1]);
			if (!input) return "Usage: program <n|name>";
			mixer.cutTo(input.id);
			return null;
		}
		case "source": {
			const input = resolveInput(tokens[1]);
			if (!input) return "Usage: source <n> <url|youtube|live|hls|clear>";
			const arg = (tokens[2] ?? "").toLowerCase();
			if (!arg) {
				const current = mixer.feeds[input.id];
				return current ? `${input.name}  ${current.label}  ${current.playbackUrl ?? current.url}  ${current.status}` : `${input.name}  (camera plate)`;
			}
			if (arg === "clear" || arg === "off" || arg === "none") {
				mixer.clearFeed(input.id);
				return null;
			}
			const url = (arg === "youtube" || arg === "yt" ? "https://www.youtube.com/watch?v=aqz-KE-bpKQ" : arg === "live" ? "https://www.youtube.com/watch?v=jfKfPfyJRdk" : arg === "hls" ? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" : null) ?? tokens[2];
			const parsed = parseFeedUrl(url, arg === "hls" ? "hls" : arg === "live" || arg === "yt" || arg === "youtube" ? "youtube" : "auto");
			if (!("kind" in parsed)) {
				mixer.log("error", parsed.error);
				return parsed.error;
			}
			mixer.setFeed(input.id, withPlayback(parsed, tokens[3]));
			return null;
		}
		case "overlay": {
			const n = Number(tokens[1]);
			if (n < 1 || n > 4) return "Usage: overlay <1-4> [on|off]";
			const flag = tokens[2]?.toLowerCase();
			const on = flag === "on" ? true : flag === "off" ? false : void 0;
			mixer.toggleOverlay(n - 1, on);
			return null;
		}
		case "scene": {
			const q = (tokens[1] ?? "").toLowerCase();
			const scene = SCENES.find((s) => s.id === q || s.name.toLowerCase() === q);
			if (!scene) {
				mixer.log("info", `Scenes  ${SCENES.map((s) => s.name).join("  ")}`);
				return `Scenes: ${SCENES.map((s) => s.name).join(", ")}`;
			}
			mixer.applyScene(scene.id, tokens[2] === "take");
			return null;
		}
		case "mute":
		case "unmute": {
			const bus = resolveBus(tokens[1]) ?? "master";
			const shouldMute = cmd === "mute";
			if (mixer.mutes[bus] !== shouldMute) mixer.toggleMute(bus);
			return null;
		}
		case "gain": {
			const bus = resolveBus(tokens[1]);
			const val = Number(tokens[2]);
			if (!bus || !Number.isFinite(val)) return "Usage: gain <bus> <0-100>";
			mixer.setGain(bus, val / 100);
			mixer.log("ok", `${bus.toUpperCase()}  fader ${Math.round(val)}%`);
			return null;
		}
		case "record": {
			const arg = tokens[1]?.toLowerCase();
			if (arg === "start" && mixer.recording) return "Already recording.";
			if (arg === "stop" && !mixer.recording) return "Not recording.";
			if (arg === "start" && !mixer.recording || arg === "stop" && mixer.recording || !arg) mixer.toggleRecord();
			return null;
		}
		case "stream": {
			const arg = tokens[1]?.toLowerCase();
			if (arg === "start" && mixer.streaming) return "Already live.";
			if (arg === "stop" && !mixer.streaming) return "Not streaming.";
			if (arg === "start" && !mixer.streaming || arg === "stop" && mixer.streaming || !arg) mixer.toggleStream();
			return null;
		}
		case "audio":
			mixer.armAudio();
			return null;
		case "cam":
			mixer.armWebcam();
			return null;
		case "inputs": {
			const rows = INPUTS.map((i) => {
				const feed = mixer.feeds[i.id];
				const extra = feed ? `  ${feed.label} ${feed.status}` : "";
				return `${i.num}  ${i.name.padEnd(6)}  ${i.label}${extra}`;
			});
			mixer.log("info", INPUTS.map((i) => `${i.num} ${i.name}`).join("  "));
			return rows.join("\n");
		}
		case "status": {
			const pgm = inputById(mixer.programId);
			const pvw = inputById(mixer.previewId);
			const msg = `PGM ${pgm?.name}  PVW ${pvw?.name}  ${mixer.transition} ${mixer.durationMs}ms  ${mixer.streaming ? "LIVE" : "off"}  ${mixer.recording ? "REC" : "idle"}`;
			mixer.log("info", msg);
			return msg;
		}
		case "help":
			mixer.log("info", "take auto fade wipe preview source overlay scene rec stream");
			return COMMANDS.map((c) => `${c.usage.padEnd(36)} ${c.hint}`).join("\n");
		case "clear":
			useMixer.setState({ logs: [] });
			return null;
		default: return null;
	}
}
function TuiDock({ expanded = false, className }) {
	const logs = useMixer((s) => s.logs);
	const [value, setValue] = (0, import_react.useState)("");
	const [sel, setSel] = (0, import_react.useState)(0);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [histIdx, setHistIdx] = (0, import_react.useState)(-1);
	const logRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const suggestions = (0, import_react.useMemo)(() => suggestCommands(value), [value]);
	const showSuggest = value.trim().length > 0 && suggestions.length > 0;
	(0, import_react.useEffect)(() => {
		const el = logRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [logs.length]);
	function submit(raw) {
		const line = (raw ?? value).trim();
		if (!line) return;
		const extra = runCommand(line);
		if (extra) extra.split("\n").forEach((msg) => useMixer.getState().log("info", msg));
		setHistory((h) => [...h.slice(-40), line]);
		setHistIdx(-1);
		setValue("");
		setSel(0);
	}
	function onKeyDown(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			if (showSuggest && suggestions[sel] && !value.includes(" ")) {
				submit(suggestions[sel].name);
				return;
			}
			submit();
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			const first = suggestions[sel] ?? suggestions[0];
			if (first && !value.includes(" ")) setValue(first.name + " ");
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (showSuggest) setSel((n) => Math.min(suggestions.length - 1, n + 1));
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (showSuggest) {
				setSel((n) => Math.max(0, n - 1));
				return;
			}
			if (history.length) {
				const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
				setHistIdx(next);
				setValue(history[next] ?? "");
			}
			return;
		}
		if (e.key === "Escape") {
			setValue("");
			inputRef.current?.blur();
		}
	}
	const levelColor = {
		info: "text-info",
		ok: "text-ok",
		warn: "text-warn",
		error: "text-program"
	};
	const levelTag = {
		info: "INFO",
		ok: "DONE",
		warn: "WARN",
		error: "FAIL"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("flex min-h-0 flex-col overflow-hidden rounded-md bg-bg font-mono text-[12px] shadow-[var(--shadow-border)]", expanded ? "h-full" : "h-[13.5rem] max-lg:h-full lg:h-52", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ffmix-cli  ·  Laravel Prompts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "Tab complete  ·  / to focus  ·  Enter cut  ·  Space auto"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 lg:grid-cols-[1fr_16rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: logRef,
					className: "tui-scroll min-h-0 overflow-auto px-3 py-2",
					children: logs.slice(expanded ? -80 : -24).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "leading-5 text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mr-2 inline-block w-10", levelColor[line.level]),
							children: levelTag[line.level]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg/90",
							children: line.msg
						})]
					}, line.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden border-l border-border p-2 lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[10px] tracking-[0.14em] text-muted",
						children: "COMMANDS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5 text-[11px] text-muted",
						children: COMMANDS.slice(0, 10).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "w-full truncate text-left hover:text-tui",
							onClick: () => {
								setValue(c.name + " ");
								inputRef.current?.focus();
							},
							children: c.usage
						}) }, c.name))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative border-t border-border",
				children: [showSuggest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-2 bottom-full z-10 mb-1 overflow-hidden rounded-sm border border-border bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "border-b border-border px-3 py-1 text-[10px] text-muted",
						children: "Select command"
					}), suggestions.slice(0, 6).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onMouseEnter: () => setSel(i),
						onClick: () => submit(c.name),
						className: cn("flex min-h-11 w-full items-center gap-2 px-3 py-1.5 text-left text-[12px]", i === sel ? "bg-tui/15 text-tui" : "text-muted"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-3",
								children: i === sel ? "›" : " "
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-24",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-muted",
								children: c.hint
							})
						]
					}, c.name))]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 px-3 py-2 max-lg:min-h-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-tui",
						children: "❯"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "ffmix-prompt",
						ref: inputRef,
						value,
						onChange: (e) => {
							setValue(e.target.value);
							setSel(0);
						},
						onKeyDown,
						spellCheck: false,
						autoComplete: "off",
						autoCapitalize: "off",
						placeholder: "take  ·  source 3 youtube  ·  fade 800  ·  overlay 1",
						className: "h-8 min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-subtle",
						suppressHydrationWarning: true
					})]
				})]
			})
		]
	});
}
function useHotkeys() {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const el = e.target;
			const typing = el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.isContentEditable;
			if (e.key === "/" || e.key === "`") {
				if (!typing) {
					e.preventDefault();
					document.getElementById("ffmix-prompt")?.focus();
				}
				return;
			}
			if (e.key === "Escape") {
				el?.blur?.();
				return;
			}
			if (typing) return;
			if (e.key >= "0" && e.key <= "9") {
				const input = inputByNum(Number(e.key));
				if (!input) return;
				if (input.kind === "webcam") useMixer.getState().armWebcam();
				else useMixer.getState().setPreview(input.id);
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault();
				useMixer.getState().cutTo();
				return;
			}
			if (e.key === " ") {
				e.preventDefault();
				useMixer.getState().auto();
				return;
			}
			if (e.key === "r" || e.key === "R") {
				useMixer.getState().toggleRecord();
				return;
			}
			if (e.key === "l" || e.key === "L") {
				useMixer.getState().toggleStream();
				return;
			}
			if (e.key === "F1") {
				e.preventDefault();
				useMixer.getState().toggleOverlay(0);
			}
			if (e.key === "F2") {
				e.preventDefault();
				useMixer.getState().toggleOverlay(1);
			}
			if (e.key === "F3") {
				e.preventDefault();
				useMixer.getState().toggleOverlay(2);
			}
			if (e.key === "F4") {
				e.preventDefault();
				useMixer.getState().toggleOverlay(3);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
}
//#endregion
export { useHotkeys as n, TuiDock as t };
