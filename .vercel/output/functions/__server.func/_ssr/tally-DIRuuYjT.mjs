import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as INPUTS, n as useMixer, p as inputById, x as feedBadge } from "./router-FzZyU0qp.mjs";
import { a as useReverb, i as cn, r as TopBar, t as MonitorStack } from "./TopBar-CugN3m1-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tally-DIRuuYjT.js
var import_jsx_runtime = require_jsx_runtime();
function TallyView() {
	const reverb = useReverb("floor", "Floor");
	const programId = useMixer((s) => s.programId);
	const previewId = useMixer((s) => s.previewId);
	const streaming = useMixer((s) => s.streaming);
	const feeds = useMixer((s) => s.feeds);
	const pgm = inputById(programId);
	const pgmFeed = feeds[programId];
	const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;
	const source = feedBadge(pgmFeed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			reverbLabel: reverb.joined ? "on" : "local",
			peers: peerCount
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.2em] text-program",
							children: "FLOOR TALLY"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-sans text-xl font-medium tracking-tight sm:text-2xl",
							children: pgm ? `${pgm.name}  ·  ${source ?? pgm.label}` : "No program"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex h-12 items-center justify-center rounded-md px-4 font-mono text-xs sm:h-auto sm:py-1.5", streaming ? "bg-program text-fg" : "bg-elevated text-muted"),
						children: streaming ? "ON AIR" : "STAND BY"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-video overflow-hidden rounded-lg ring-2 ring-program shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorStack, { which: "program" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-5",
					children: INPUTS.map((input) => {
						const pgmOn = programId === input.id;
						const pvwOn = previewId === input.id;
						const badge = feedBadge(feeds[input.id]);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex min-h-16 flex-col justify-center rounded-md px-3 py-2 sm:min-h-14", pgmOn ? "bg-program text-fg" : pvwOn ? "bg-preview/20 text-fg shadow-[inset_0_0_0_1px_var(--color-preview)]" : "bg-elevated text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px]",
									children: input.num
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: input.name
								}),
								badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] opacity-80",
									children: badge
								}) : null
							]
						}, input.id);
					})
				})
			]
		})]
	});
}
function TallyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TallyView, {});
}
//#endregion
export { TallyPage as component };
