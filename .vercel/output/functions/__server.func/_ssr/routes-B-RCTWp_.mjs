import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as LayoutGrid, c as Cable, l as AudioLines, n as SquareTerminal, r as Settings2, s as Captions } from "../_libs/lucide-react.mjs";
import { E as withPlayback, T as parseFeedUrl, _ as SAMPLE_HLS, b as SAMPLE_YOUTUBE_LIVE, c as GFX_SAMPLES, d as SCENES, g as SAMPLE_AUDIO, i as setPresence, l as INPUTS, n as useMixer, p as inputById, r as readMeters, s as AUDIO_BUSES, u as OVERLAYS, v as SAMPLE_POSTER, x as feedBadge, y as SAMPLE_YOUTUBE } from "./router-FzZyU0qp.mjs";
import { a as useReverb, i as cn, n as Monitors, r as TopBar } from "./TopBar-CugN3m1-.mjs";
import { n as useHotkeys, t as TuiDock } from "./useHotkeys-hkC2gB4v.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-RCTWp_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Meter({ value, horizontal = false }) {
	const pct = Math.round(value * 100);
	if (horizontal) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-1.5 w-full overflow-hidden rounded-full bg-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-y-0 left-0 rounded-full bg-preview",
			style: { width: `${pct}%` }
		}), pct > 85 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 right-0 w-3 bg-program" }) : null]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-28 w-1.5 overflow-hidden rounded-full bg-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 bottom-0 rounded-full bg-preview",
			style: { height: `${pct}%` }
		}), pct > 85 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-3 bg-program" }) : null]
	});
}
function AudioBoard() {
	const gains = useMixer((s) => s.gains);
	const mutes = useMixer((s) => s.mutes);
	const setGain = useMixer((s) => s.setGain);
	const toggleMute = useMixer((s) => s.toggleMute);
	const armAudio = useMixer((s) => s.armAudio);
	const audioArmed = useMixer((s) => s.audioArmed);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [levels, setLevels] = (0, import_react.useState)({
		cam1: 0,
		cam2: 0,
		cam4: 0,
		media: 0,
		master: 0
	});
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!audioArmed) return;
		const id = window.setInterval(() => setLevels(readMeters()), 80);
		return () => window.clearInterval(id);
	}, [audioArmed]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full min-h-0 flex-col rounded-md bg-elevated p-2 shadow-[var(--shadow-border)] max-lg:p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] tracking-[0.16em] text-muted",
					children: "AUDIO"
				}), !audioArmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void armAudio(),
					className: "h-11 rounded-sm bg-surface px-3 font-mono text-[11px] text-fg lg:h-8 lg:px-2 lg:text-[10px]",
					children: "Arm"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-preview",
					children: "LIVE"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col gap-1 lg:hidden",
				children: AUDIO_BUSES.map((bus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-md bg-surface px-2 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-12 shrink-0 font-mono text-[11px] text-muted",
							children: bus.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								value: levels[bus.id],
								horizontal: true
							}), mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
								orientation: "horizontal",
								min: 0,
								max: 100,
								step: 1,
								value: [Math.round(gains[bus.id] * 100)],
								onValueChange: (v) => setGain(bus.id, (v[0] ?? 0) / 100),
								className: "relative flex h-8 w-full touch-none items-center",
								"aria-label": `${bus.label} fader`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
									className: "relative h-1 w-full rounded-full bg-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-5 rounded-sm bg-fg shadow-[var(--shadow-border)] focus:outline-none" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-full rounded-sm bg-border" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleMute(bus.id),
							className: cn("size-11 shrink-0 rounded-sm font-mono text-[11px]", mutes[bus.id] ? "bg-program text-fg" : "bg-elevated text-muted"),
							children: mutes[bus.id] ? "M" : "ON"
						})
					]
				}, bus.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden justify-between gap-1 overflow-x-auto lg:flex",
				children: AUDIO_BUSES.map((bus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-12 flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { value: levels[bus.id] }), mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
							orientation: "vertical",
							min: 0,
							max: 100,
							step: 1,
							value: [Math.round(gains[bus.id] * 100)],
							onValueChange: (v) => setGain(bus.id, (v[0] ?? 0) / 100),
							className: "relative flex h-28 w-5 touch-none items-center justify-center",
							"aria-label": `${bus.label} fader`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
								className: "relative h-full w-1 rounded-full bg-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute w-full rounded-full bg-accent" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-sm bg-fg shadow-[var(--shadow-border)] focus:outline-none" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 w-5 rounded-sm bg-border" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toggleMute(bus.id),
						className: cn("h-8 min-w-10 rounded-sm px-1 font-mono text-[10px]", mutes[bus.id] ? "bg-program text-fg" : "bg-surface text-muted"),
						children: mutes[bus.id] ? "M" : bus.label
					})]
				}, bus.id))
			})
		]
	});
}
var TRANSITIONS = [
	{
		id: "fade",
		label: "Fade"
	},
	{
		id: "wipe",
		label: "Wipe"
	},
	{
		id: "slide",
		label: "Slide"
	},
	{
		id: "zoom",
		label: "Zoom"
	}
];
function TakeBar({ className }) {
	const cutTo = useMixer((s) => s.cutTo);
	const auto = useMixer((s) => s.auto);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("take-bar grid grid-cols-2 gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => cutTo(),
			className: "h-12 rounded-md bg-fg font-mono text-sm font-semibold text-bg transition-transform duration-150 ease-out active:scale-[0.97]",
			children: "CUT"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: auto,
			className: "h-12 rounded-md bg-elevated font-mono text-sm font-semibold text-fg shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.97]",
			children: "AUTO"
		})]
	});
}
function DurationStepper() {
	const durationMs = useMixer((s) => s.durationMs);
	const setDuration = useMixer((s) => s.setDuration);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-12 shrink-0 items-center rounded-md bg-elevated",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Shorter transition",
				onClick: () => setDuration(Math.max(100, durationMs - 100)),
				className: "flex size-12 items-center justify-center font-mono text-lg leading-none text-muted",
				children: "−"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-9 text-center font-mono text-[11px] tabular-nums text-fg",
				children: durationMs
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Longer transition",
				onClick: () => setDuration(Math.min(2e3, durationMs + 100)),
				className: "flex size-12 items-center justify-center font-mono text-lg leading-none text-muted",
				children: "+"
			})
		]
	});
}
function ControlSurface() {
	const transition = useMixer((s) => s.transition);
	const durationMs = useMixer((s) => s.durationMs);
	const overlays = useMixer((s) => s.overlays);
	const overlayOut = useMixer((s) => s.overlayOut);
	const setTransition = useMixer((s) => s.setTransition);
	const setDuration = useMixer((s) => s.setDuration);
	const cutTo = useMixer((s) => s.cutTo);
	const auto = useMixer((s) => s.auto);
	const toggleOverlay = useMixer((s) => s.toggleOverlay);
	const applyScene = useMixer((s) => s.applyScene);
	const previewId = useMixer((s) => s.previewId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden shrink-0 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chip-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => cutTo(),
					className: "h-12 min-w-[4.5rem] shrink-0 rounded-md bg-fg px-4 font-mono text-xs font-semibold text-bg transition-transform duration-150 ease-out active:scale-[0.96] sm:h-11",
					children: "CUT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: auto,
					className: "h-12 min-w-[4.5rem] shrink-0 rounded-md bg-elevated px-4 font-mono text-xs font-semibold text-fg shadow-[var(--shadow-border)] transition-transform duration-150 ease-out active:scale-[0.96] sm:h-11",
					children: "AUTO"
				}),
				TRANSITIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTransition(t.id),
					className: cn("h-12 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150 sm:h-11", transition === t.id ? "bg-accent text-bg" : "bg-elevated text-muted hover:text-fg"),
					children: t.label
				}, t.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "ml-1 flex h-12 shrink-0 items-center gap-2 font-mono text-[10px] text-muted sm:h-11",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: durationMs
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ms" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mix-range w-24",
							type: "range",
							min: 100,
							max: 2e3,
							step: 50,
							value: durationMs,
							onChange: (e) => setDuration(Number(e.target.value)),
							"aria-label": "Transition duration",
							suppressHydrationWarning: true
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chip-row",
			children: [
				OVERLAYS.map((o) => {
					const on = overlays[o.i] && !overlayOut[o.i];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => toggleOverlay(o.i),
						className: cn("h-11 min-w-12 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150", on ? "bg-program/20 text-fg shadow-[inset_0_0_0_1px_var(--color-program)]" : "bg-elevated text-muted hover:text-fg"),
						children: [
							o.i + 1,
							" ",
							o.label
						]
					}, o.i);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 hidden h-6 w-px shrink-0 bg-border sm:block" }),
				SCENES.map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => applyScene(scene.id),
					onDoubleClick: () => applyScene(scene.id, true),
					className: cn("h-11 shrink-0 rounded-md px-3 font-mono text-[11px] transition-colors duration-150", previewId === scene.previewId ? "bg-surface text-fg shadow-[var(--shadow-border-hover)]" : "bg-elevated text-muted hover:text-fg"),
					children: scene.name
				}, scene.id))
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex shrink-0 flex-col gap-1.5 lg:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [TRANSITIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTransition(t.id),
				className: cn("h-12 min-w-0 flex-1 rounded-md font-mono text-[11px] transition-colors duration-150", transition === t.id ? "bg-accent text-bg" : "bg-elevated text-muted"),
				children: t.label
			}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurationStepper, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-5 gap-1",
			children: SCENES.map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => applyScene(scene.id),
				className: cn("h-12 min-w-0 rounded-md px-1 font-mono text-[11px] transition-colors duration-150", previewId === scene.previewId ? "bg-surface text-fg shadow-[var(--shadow-border-hover)]" : "bg-elevated text-muted"),
				children: scene.name
			}, scene.id))
		})]
	})] });
}
function GfxEditor() {
	const name = useMixer((s) => s.lowerThirdName);
	const title = useMixer((s) => s.lowerThirdTitle);
	const ticker = useMixer((s) => s.ticker);
	const scoreHome = useMixer((s) => s.scoreHome);
	const scoreAway = useMixer((s) => s.scoreAway);
	const scoreHomeN = useMixer((s) => s.scoreHomeN);
	const scoreAwayN = useMixer((s) => s.scoreAwayN);
	const overlays = useMixer((s) => s.overlays);
	const overlayOut = useMixer((s) => s.overlayOut);
	const setLowerThird = useMixer((s) => s.setLowerThird);
	const setTicker = useMixer((s) => s.setTicker);
	const setScore = useMixer((s) => s.setScore);
	const toggleOverlay = useMixer((s) => s.toggleOverlay);
	const applyGfxSample = useMixer((s) => s.applyGfxSample);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-0.5 font-mono text-[10px] tracking-[0.16em] text-muted",
				children: "GFX SAMPLES  ·  IN / OUT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1 sm:grid-cols-6",
				children: GFX_SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => applyGfxSample(sample.id),
					className: "flex h-14 min-w-0 flex-col items-start justify-center rounded-md bg-elevated px-2 text-left active:scale-[0.98] sm:h-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[12px] text-fg",
						children: sample.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden w-full truncate font-mono text-[10px] text-subtle sm:block",
						children: sample.hint
					})]
				}, sample.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1 sm:grid-cols-4",
				children: OVERLAYS.map((o) => {
					const on = overlays[o.i] && !overlayOut[o.i];
					const leaving = overlayOut[o.i];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex overflow-hidden rounded-md bg-elevated",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 px-2 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] text-fg",
									children: o.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[10px] text-subtle",
									children: leaving ? "out" : on ? "hold" : "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleOverlay(o.i, true),
								className: cn("h-12 w-11 shrink-0 font-mono text-[10px]", on ? "bg-preview/20 text-preview" : "text-muted"),
								children: "IN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleOverlay(o.i, false),
								className: cn("h-12 w-11 shrink-0 font-mono text-[10px]", leaving ? "text-warn" : "text-muted"),
								children: "OUT"
							})
						]
					}, o.i);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "LT NAME"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setLowerThird(e.target.value, title),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "LT TITLE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (e) => setLowerThird(name, e.target.value),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "TICKER"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: ticker,
							onChange: (e) => setTicker(e.target.value),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "HOME"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: scoreHome,
							onChange: (e) => setScore({ scoreHome: e.target.value }),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "HOME N"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: scoreHomeN,
							onChange: (e) => setScore({ scoreHomeN: Number(e.target.value) }),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "AWAY"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: scoreAway,
							onChange: (e) => setScore({ scoreAway: e.target.value }),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted",
							children: "AWAY N"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: scoreAwayN,
							onChange: (e) => setScore({ scoreAwayN: Number(e.target.value) }),
							className: "bg-transparent text-base text-fg outline-none sm:text-sm",
							suppressHydrationWarning: true
						})]
					})
				]
			})
		]
	});
}
var MODES = [
	{
		id: "auto",
		label: "Auto"
	},
	{
		id: "youtube",
		label: "YouTube"
	},
	{
		id: "hls",
		label: "HLS"
	},
	{
		id: "rtmp",
		label: "RTMP"
	},
	{
		id: "audio",
		label: "Audio"
	}
];
var SAMPLES = [
	{
		label: "YouTube · BBB",
		url: SAMPLE_YOUTUBE,
		mode: "youtube"
	},
	{
		label: "YouTube Live",
		url: SAMPLE_YOUTUBE_LIVE,
		mode: "youtube"
	},
	{
		label: "HLS · Mux",
		url: SAMPLE_HLS,
		mode: "hls"
	},
	{
		label: "Audio bed",
		url: SAMPLE_AUDIO,
		mode: "audio",
		poster: SAMPLE_POSTER
	}
];
function forceFor(mode) {
	if (mode === "auto") return "auto";
	return mode;
}
async function posterFromFile(file) {
	const blobUrl = URL.createObjectURL(file);
	try {
		const image = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("Image failed"));
			el.src = blobUrl;
		});
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 960 / Math.max(image.width, image.height));
		canvas.width = Math.max(2, Math.round(image.width * scale));
		canvas.height = Math.max(2, Math.round(image.height * scale));
		const ctx = canvas.getContext("2d");
		if (!ctx) return blobUrl;
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .82);
	} finally {
		URL.revokeObjectURL(blobUrl);
	}
}
function SourceDialog({ inputId, onClose }) {
	const input = inputById(inputId);
	const feed = useMixer((s) => s.feeds[inputId]);
	const setFeed = useMixer((s) => s.setFeed);
	const clearFeed = useMixer((s) => s.clearFeed);
	const [mode, setMode] = (0, import_react.useState)(() => {
		if (feed?.kind === "youtube") return "youtube";
		if (feed?.kind === "rtmp") return "rtmp";
		if (feed?.kind === "audio" || feed?.audioOnly) return "audio";
		if (feed?.kind === "hls" || feed?.kind === "flv") return "hls";
		return "auto";
	});
	const [url, setUrl] = (0, import_react.useState)(feed?.url ?? "");
	const [playback, setPlayback] = (0, import_react.useState)(feed?.playbackUrl ?? "");
	const [poster, setPoster] = (0, import_react.useState)(feed?.poster ?? "");
	const [error, setError] = (0, import_react.useState)(null);
	const showPlayback = mode === "rtmp" || /^rtmps?:\/\//i.test(url.trim());
	const showPoster = mode === "audio" || mode === "auto";
	const preview = (0, import_react.useMemo)(() => {
		const parsed = parseFeedUrl(url, forceFor(mode), poster);
		if (!("kind" in parsed)) return parsed;
		return withPlayback(parsed, showPlayback ? playback : void 0, poster);
	}, [
		url,
		mode,
		playback,
		poster,
		showPlayback
	]);
	function apply() {
		const parsed = parseFeedUrl(url, forceFor(mode), poster);
		if (!("kind" in parsed)) {
			setError(parsed.error);
			return;
		}
		const next = withPlayback(parsed, showPlayback ? playback : void 0, poster);
		setFeed(inputId, next);
		onClose();
	}
	if (!input) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-lg bg-surface shadow-[var(--shadow-border)] outline-none sm:inset-x-auto sm:bottom-auto sm:top-[6%] sm:left-1/2 sm:w-[32rem] sm:-translate-x-1/2 sm:rounded-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2 sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "sheet-handle" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-sans text-base font-medium",
						children: "Input source"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "font-mono text-[11px] text-muted",
						children: [
							input.num,
							"  ",
							input.name,
							"  ·  ",
							input.label
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "flex size-11 items-center justify-center font-mono text-[11px] text-muted hover:text-fg",
						children: "Close"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-1",
							children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode(m.id);
									setError(null);
								},
								className: cn("h-11 rounded-md px-1 font-mono text-[11px] transition-colors duration-150", mode === m.id ? "bg-accent text-bg" : "bg-elevated text-muted hover:text-fg"),
								children: m.label
							}, m.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-muted",
								children: mode === "rtmp" ? "RTMP PUBLISH" : mode === "youtube" ? "YOUTUBE URL" : mode === "audio" ? "AUDIO URL  ·  mp3 / aac / ogg" : "URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: url,
								onChange: (e) => {
									setUrl(e.target.value);
									setError(null);
								},
								onKeyDown: (e) => {
									if (e.key === "Enter") apply();
								},
								spellCheck: false,
								autoComplete: "off",
								placeholder: mode === "rtmp" ? "rtmp://ingest.example.com/live/key" : mode === "youtube" ? "https://youtube.com/watch?v=…  or  /live/…" : mode === "audio" ? "https://cdn.example.com/bed.mp3" : "https://…m3u8   ·   youtube.com   ·   rtmp://   ·   .mp3",
								className: "bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle",
								autoFocus: true
							})]
						}),
						showPlayback ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-14 flex-col justify-center gap-1 rounded-md bg-elevated px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-muted",
								children: "PLAYBACK  ·  HLS / HTTP-FLV"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: playback,
								onChange: (e) => {
									setPlayback(e.target.value);
									setError(null);
								},
								onKeyDown: (e) => {
									if (e.key === "Enter") apply();
								},
								spellCheck: false,
								autoComplete: "off",
								placeholder: "https://cdn.example.com/live.m3u8",
								className: "bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
							})]
						}) : null,
						showPoster ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 rounded-md bg-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-muted",
									children: "POSTER  ·  audio-only still"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: poster,
									onChange: (e) => setPoster(e.target.value),
									spellCheck: false,
									autoComplete: "off",
									placeholder: "https://…jpg  or choose a file",
									className: "bg-transparent font-mono text-sm text-fg outline-none placeholder:text-subtle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex h-11 flex-1 items-center justify-center rounded-md bg-surface font-mono text-[11px] text-fg",
										children: ["Choose image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "sr-only",
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (!file) return;
												posterFromFile(file).then((data) => {
													setPoster(data);
													setError(null);
												}).catch(() => setError("Could not read that image"));
											}
										})]
									}), poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: poster,
										alt: "",
										className: "h-11 w-16 rounded-sm object-cover"
									}) : null]
								})
							]
						}) : null,
						mode === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] leading-5 text-muted",
							children: "Audio beds play under Program with a still poster. Assign an mp3/aac/ogg URL, then set a thumbnail so the bus is not a black frame."
						}) : mode === "rtmp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] leading-5 text-muted",
							children: "Browsers cannot ingest RTMP. Keep the publish URL for your encoder, then paste the HLS or HTTP-FLV playback URL your CDN exposes."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] leading-5 text-muted",
							children: "YouTube, HLS, HTTP-FLV and files sit under Preview/Program. Same CUT / AUTO / overlays as the studio cameras."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: SAMPLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode(s.mode);
									setUrl(s.url);
									setPlayback("");
									setPoster(s.poster ?? "");
									setError(null);
								},
								className: "h-11 rounded-md bg-elevated px-3 font-mono text-[11px] text-muted hover:text-fg",
								children: s.label
							}, s.label))
						}),
						!("kind" in preview) && url.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-program",
							children: preview.error
						}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] text-program",
							children: error
						}) : url.trim() && "kind" in preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-ok",
							children: [
								preview.label,
								preview.audioOnly ? "  ·  audio-only" : "",
								preview.poster ? "  ·  poster set" : "",
								preview.kind === "rtmp" && !preview.playbackUrl ? "  ·  waiting on playback URL" : "",
								preview.youtubeId ? `  ·  ${preview.youtubeId}` : ""
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							clearFeed(inputId);
							onClose();
						},
						className: "h-12 rounded-md px-3 font-mono text-[11px] text-muted hover:text-fg",
						children: "Clear"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							className: "h-12 rounded-md bg-elevated px-4 font-mono text-[11px] text-muted hover:text-fg",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: apply,
							className: "h-12 rounded-md bg-fg px-5 font-mono text-[11px] font-semibold text-bg",
							children: "Assign"
						})]
					})]
				})
			]
		})] })
	});
}
function InputGrid() {
	const programId = useMixer((s) => s.programId);
	const previewId = useMixer((s) => s.previewId);
	const overlays = useMixer((s) => s.overlays);
	const feeds = useMixer((s) => s.feeds);
	const setPreview = useMixer((s) => s.setPreview);
	const cutTo = useMixer((s) => s.cutTo);
	const armWebcam = useMixer((s) => s.armWebcam);
	const webcamReady = useMixer((s) => s.webcamReady);
	const [sourceId, setSourceId] = (0, import_react.useState)(null);
	const holdRef = (0, import_react.useRef)(0);
	function armInput(id, kind, feed) {
		if (kind === "webcam" && !webcamReady && !feed) {
			armWebcam();
			return false;
		}
		return true;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid shrink-0 grid-cols-2 gap-1.5 max-lg:min-h-0 max-lg:flex-1 lg:grid-cols-5",
		children: INPUTS.map((input) => {
			const pgm = programId === input.id;
			const pvw = previewId === input.id;
			const onAirOverlay = pgm && overlays.some(Boolean);
			const feed = feeds[input.id];
			const badge = feedBadge(feed);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-h-14 items-stretch rounded-md transition-[box-shadow,background-color] duration-150 max-lg:h-full lg:min-h-11", pgm ? "bg-program/15 shadow-[inset_0_0_0_1px_var(--color-program)]" : pvw ? "bg-preview/10 shadow-[inset_0_0_0_1px_var(--color-preview)]" : "bg-elevated shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onPointerDown: () => {
						window.clearTimeout(holdRef.current);
						holdRef.current = window.setTimeout(() => setSourceId(input.id), 480);
					},
					onPointerUp: () => window.clearTimeout(holdRef.current),
					onPointerLeave: () => window.clearTimeout(holdRef.current),
					onPointerCancel: () => window.clearTimeout(holdRef.current),
					onContextMenu: (e) => {
						e.preventDefault();
						setSourceId(input.id);
					},
					onClick: () => {
						if (!armInput(input.id, input.kind, Boolean(feed))) return;
						setPreview(input.id);
					},
					onDoubleClick: () => {
						if (!armInput(input.id, input.kind, Boolean(feed))) return;
						cutTo(input.id);
					},
					className: "flex min-w-0 flex-1 select-none flex-col items-start justify-center gap-0.5 px-2.5 py-2 text-left active:scale-[0.99]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex w-full items-center justify-between font-mono text-[10px] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: input.num }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									feed?.kind === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-info",
										children: "AUD"
									}) : null,
									feed?.status === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-program",
										children: "LIVE"
									}) : null,
									pvw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-preview",
										children: "PVW"
									}) : null,
									pgm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-program",
										children: "PGM"
									}) : null,
									onAirOverlay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden text-muted lg:inline",
										children: "GFX"
									}) : null
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-full truncate font-sans text-sm font-medium leading-none",
							children: input.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden max-w-full truncate font-mono text-[10px] text-muted lg:block",
							children: badge ?? input.label
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Set source for ${input.name}`,
					onClick: () => setSourceId(input.id),
					className: "hidden w-11 shrink-0 items-center justify-center text-muted hover:text-fg lg:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-3.5" })
				})]
			}, input.id);
		})
	}), sourceId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceDialog, {
		inputId: sourceId,
		onClose: () => setSourceId(null)
	}) : null] });
}
function SourceBoard() {
	const programId = useMixer((s) => s.programId);
	const previewId = useMixer((s) => s.previewId);
	const feeds = useMixer((s) => s.feeds);
	const setPreview = useMixer((s) => s.setPreview);
	const [assignId, setAssignId] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-0.5 font-mono text-[10px] tracking-[0.16em] text-muted",
				children: "INPUTS  ·  video  ·  audio + poster"
			}),
			INPUTS.map((input) => {
				const feed = feeds[input.id];
				const pgm = programId === input.id;
				const pvw = previewId === input.id;
				const badge = feedBadge(feed);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-stretch gap-1 rounded-md bg-elevated", pgm && "shadow-[inset_0_0_0_1px_var(--color-program)]", pvw && !pgm && "shadow-[inset_0_0_0_1px_var(--color-preview)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPreview(input.id),
						className: "flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-4 font-mono text-[11px] text-muted",
								children: input.num
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: input.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate font-mono text-[10px] text-muted",
									children: [
										badge ?? input.label,
										feed?.kind === "audio" ? "  ·  audio" : "",
										feed?.poster ? "  ·  poster" : ""
									]
								})]
							}),
							pgm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-program",
								children: "PGM"
							}) : null,
							pvw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-preview",
								children: "PVW"
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAssignId(input.id),
						className: "h-14 w-[4.5rem] shrink-0 rounded-md bg-surface font-mono text-[11px] text-fg",
						children: "Assign"
					})]
				}, input.id);
			}),
			assignId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceDialog, {
				inputId: assignId,
				onClose: () => setAssignId(null)
			}) : null
		]
	});
}
var PANELS = [
	{
		id: "mix",
		label: "Mix",
		Icon: LayoutGrid
	},
	{
		id: "gfx",
		label: "GFX",
		Icon: Captions
	},
	{
		id: "src",
		label: "Src",
		Icon: Cable
	},
	{
		id: "aud",
		label: "Aud",
		Icon: AudioLines
	},
	{
		id: "tui",
		label: "TUI",
		Icon: SquareTerminal
	}
];
function MixerApp() {
	const reverb = useReverb("director", "Director");
	useHotkeys();
	const [panel, setPanel] = (0, import_react.useState)("mix");
	(0, import_react.useEffect)(() => {
		return useMixer.subscribe((s) => {
			const bus = inputById(s.programId)?.bus ?? "media";
			setPresence(bus);
		});
	}, []);
	const connected = reverb.joined ? "on" : "local";
	const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mixer-app flex min-h-dvh flex-col bg-bg text-fg max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			reverbLabel: connected,
			peers: peerCount
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mixer-shell flex min-h-0 flex-1 max-lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mixer-main mx-auto flex min-h-0 min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-2 p-2 max-lg:overflow-hidden sm:p-3 lg:gap-3 lg:pb-[max(0.5rem,env(safe-area-inset-bottom))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mixer-stage flex shrink-0 flex-col gap-1.5 lg:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitors, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TakeBar, { className: "lg:hidden" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mixer-desk flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:overflow-visible",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex shrink-0 flex-col gap-1.5 lg:gap-3", panel === "mix" ? "max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto" : "max-lg:hidden"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlSurface, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGrid, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("grid min-h-0 flex-1 gap-2 lg:grid-cols-[minmax(0,1fr)_18rem]", panel === "mix" || panel === "src" ? "max-lg:hidden" : "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:overflow-hidden"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("min-h-0 lg:block", panel === "gfx" ? "max-lg:block max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto" : "max-lg:hidden"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GfxEditor, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("min-h-0 overflow-auto lg:block", panel === "aud" ? "max-lg:block max-lg:min-h-0 max-lg:flex-1" : "max-lg:hidden"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioBoard, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("min-h-0 lg:col-span-2", panel === "tui" ? "flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col" : "max-lg:hidden lg:block"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TuiDock, { className: "max-lg:h-full max-lg:min-h-0" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("min-h-0", panel === "src" ? "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col" : "hidden"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBoard, {})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mixer-rail flex shrink-0 flex-col border-l border-border bg-surface lg:hidden",
				"aria-label": "Mixer panels",
				children: PANELS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPanel(p.id),
					className: cn("relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 font-mono text-[10px] tracking-wide", panel === p.id ? "text-fg" : "text-muted"),
					children: [
						panel === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-y-3 left-0 w-px bg-fg" }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.Icon, {
							className: "size-4",
							strokeWidth: 1.75
						}),
						p.label
					]
				}, p.id))
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixerApp, {});
}
//#endregion
export { Home as component };
