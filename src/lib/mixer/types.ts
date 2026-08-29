import type { InputFeed } from "./feeds";

export type InputKind = "camera" | "media" | "bars" | "clock" | "slate" | "title" | "webcam";

export type TransitionKind = "cut" | "fade" | "wipe" | "slide" | "zoom";

export type LogLevel = "info" | "ok" | "warn" | "error";

export type AudioBusId = "cam1" | "cam2" | "cam4" | "media" | "master";

export interface MixInput {
  id: string;
  num: number;
  name: string;
  label: string;
  kind: InputKind;
  src?: string;
  bus: Exclude<AudioBusId, "master">;
}

export interface MixScene {
  id: string;
  name: string;
  previewId: string;
  overlays: [boolean, boolean, boolean, boolean];
}

export interface TransitionJob {
  fromId: string;
  toId: string;
  kind: Exclude<TransitionKind, "cut">;
  startedAt: number;
  durationMs: number;
}

export interface LogLine {
  id: number;
  t: number;
  level: LogLevel;
  msg: string;
}

export interface MixerSnapshot {
  programId: string;
  previewId: string;
  overlays: [boolean, boolean, boolean, boolean];
  recording: boolean;
  streaming: boolean;
  transition: TransitionKind;
  durationMs: number;
  transitioning: TransitionJob | null;
  recStartedAt: number | null;
  streamStartedAt: number | null;
  lowerThirdName: string;
  lowerThirdTitle: string;
  ticker: string;
  scoreHome: string;
  scoreAway: string;
  scoreHomeN: number;
  scoreAwayN: number;
  feeds: Record<string, InputFeed>;
}

export const TRANSITIONS: { id: Exclude<TransitionKind, "cut">; label: string }[] = [
  { id: "fade", label: "Fade" },
  { id: "wipe", label: "Wipe" },
  { id: "slide", label: "Slide" },
  { id: "zoom", label: "Zoom" },
];
