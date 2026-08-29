import type { AudioBusId, MixInput, MixScene } from "./types";

export const SHOW_NAME = "Night Desk";
export const SHOW_EP = "014";

export const INPUTS: MixInput[] = [
  {
    id: "cam1",
    num: 1,
    name: "CAM 1",
    label: "Studio A",
    kind: "camera",
    src: "/inputs/cam1.jpg",
    bus: "cam1",
  },
  {
    id: "cam2",
    num: 2,
    name: "CAM 2",
    label: "Wide",
    kind: "camera",
    src: "/inputs/cam2.jpg",
    bus: "cam2",
  },
  {
    id: "cam3",
    num: 3,
    name: "CAM 3",
    label: "City",
    kind: "camera",
    src: "/inputs/cam3.jpg",
    bus: "media",
  },
  {
    id: "cam4",
    num: 4,
    name: "CAM 4",
    label: "Pitch",
    kind: "camera",
    src: "/inputs/cam4.jpg",
    bus: "cam4",
  },
  {
    id: "media",
    num: 5,
    name: "MEDIA",
    label: "Bumper",
    kind: "media",
    src: "/inputs/media.jpg",
    bus: "media",
  },
  { id: "bars", num: 6, name: "BARS", label: "SMPTE", kind: "bars", bus: "media" },
  { id: "clock", num: 7, name: "CLOCK", label: "Manama", kind: "clock", bus: "media" },
  { id: "slate", num: 8, name: "SLATE", label: "Ident", kind: "slate", bus: "media" },
  { id: "title", num: 9, name: "TITLE", label: "Open", kind: "title", bus: "media" },
  { id: "webcam", num: 0, name: "CAM 0", label: "Local", kind: "webcam", bus: "cam1" },
];

export const SCENES: MixScene[] = [
  { id: "open", name: "Open", previewId: "cam2", overlays: [false, true, false, false] },
  { id: "talk", name: "Talk", previewId: "cam1", overlays: [true, true, false, false] },
  { id: "pkg", name: "Package", previewId: "cam3", overlays: [false, true, true, false] },
  { id: "sports", name: "Sports", previewId: "cam4", overlays: [false, true, false, true] },
  { id: "close", name: "Close", previewId: "title", overlays: [false, true, false, false] },
];

export const AUDIO_BUSES: { id: AudioBusId; label: string }[] = [
  { id: "cam1", label: "CAM 1" },
  { id: "cam2", label: "CAM 2" },
  { id: "cam4", label: "CAM 4" },
  { id: "media", label: "MEDIA" },
  { id: "master", label: "MST" },
];

export const OVERLAYS = [
  { i: 0 as const, label: "LT", hint: "Lower third", inMs: 420, outMs: 280 },
  { i: 1 as const, label: "Bug", hint: "Corner ident", inMs: 280, outMs: 180 },
  { i: 2 as const, label: "Tick", hint: "Crawl", inMs: 320, outMs: 220 },
  { i: 3 as const, label: "Score", hint: "Score bug", inMs: 360, outMs: 240 },
];

export interface GfxSample {
  id: string;
  name: string;
  hint: string;
  lowerThirdName?: string;
  lowerThirdTitle?: string;
  ticker?: string;
  scoreHome?: string;
  scoreAway?: string;
  scoreHomeN?: number;
  scoreAwayN?: number;
  overlays: [boolean, boolean, boolean, boolean];
}

export const GFX_SAMPLES: GfxSample[] = [
  {
    id: "talk",
    name: "Talk",
    hint: "LT slides in  ·  bug fades",
    lowerThirdName: "Hasan AlDoy",
    lowerThirdTitle: "Studio Host  ·  Night Desk",
    overlays: [true, true, false, false],
  },
  {
    id: "break",
    name: "Breaking",
    hint: "Name plate  ·  LIVE crawl",
    lowerThirdName: "BREAKING",
    lowerThirdTitle: "Manama  ·  developing",
    ticker: "BREAKING  ·  NIGHT DESK  ·  MANAMA  ·  LIVE DESK  ·  MORE TO FOLLOW  ·  STAY WITH US",
    overlays: [true, true, true, false],
  },
  {
    id: "pkg",
    name: "Package",
    hint: "Bug holds  ·  ticker rises",
    ticker: "NIGHT DESK  ·  EP 014  ·  CITY PACKAGE  ·  CAM 3  ·  MANAMA",
    overlays: [false, true, true, false],
  },
  {
    id: "sports",
    name: "Sports",
    hint: "Score drops in  ·  bug",
    scoreHome: "MHR",
    scoreAway: "RIF",
    scoreHomeN: 2,
    scoreAwayN: 1,
    overlays: [false, true, false, true],
  },
  {
    id: "ident",
    name: "Ident",
    hint: "Name plate in  ·  all else out",
    lowerThirdName: "Night Desk",
    lowerThirdTitle: "Episode 014  ·  Manama",
    overlays: [true, false, false, false],
  },
  {
    id: "clear",
    name: "Out all",
    hint: "Staggered exits",
    overlays: [false, false, false, false],
  },
];

export function inputById(id: string) {
  return INPUTS.find((i) => i.id === id);
}

export function inputByNum(n: number) {
  return INPUTS.find((i) => i.num === n);
}
