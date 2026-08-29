import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useMixer, p as inputById, x as feedBadge } from "./router-FzZyU0qp.mjs";
import { a as useReverb, r as TopBar, t as MonitorStack } from "./TopBar-CugN3m1-.mjs";
import { n as useHotkeys, t as TuiDock } from "./useHotkeys-hkC2gB4v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cli-CaGFa78c.js
var import_jsx_runtime = require_jsx_runtime();
function CliView() {
	const reverb = useReverb("director", "CLI");
	useHotkeys();
	const programId = useMixer((s) => s.programId);
	const previewId = useMixer((s) => s.previewId);
	const transition = useMixer((s) => s.transition);
	const durationMs = useMixer((s) => s.durationMs);
	const feeds = useMixer((s) => s.feeds);
	const pgm = inputById(programId);
	const pvw = inputById(previewId);
	const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			reverbLabel: reverb.joined ? "on" : "local",
			peers: peerCount
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col gap-2 p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden gap-3 lg:grid lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-md ring-1 ring-preview/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between bg-surface px-3 py-1 font-mono text-[10px] text-preview",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PREVIEW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pvw?.name, feedBadge(feeds[previewId]) ? `  ·  ${feedBadge(feeds[previewId])}` : ""] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorStack, { which: "preview" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-md ring-1 ring-program/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between bg-surface px-3 py-1 font-mono text-[10px] text-program",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROGRAM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pgm?.name, feedBadge(feeds[programId]) ? `  ·  ${feedBadge(feeds[programId])}` : ""] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorStack, { which: "program" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-32 overflow-hidden rounded-md ring-1 ring-program/70 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorStack, { which: "program" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-program",
							children: "PGM"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-fg",
							children: pgm?.name ?? "—"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate font-mono text-[11px] text-muted",
					children: [
						"php artisan ffmix  ·  ",
						transition,
						" ",
						durationMs,
						"ms  ·  PGM ",
						pgm?.name ?? "—",
						"  ·  PVW ",
						pvw?.name ?? "—"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TuiDock, {
						expanded: true,
						className: "h-full"
					})
				})
			]
		})]
	});
}
function CliPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CliView, {});
}
//#endregion
export { CliPage as component };
