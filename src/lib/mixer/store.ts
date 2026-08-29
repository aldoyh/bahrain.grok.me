import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GFX_SAMPLES, OVERLAYS, SCENES, inputById } from "./catalog";
import { getProgramCanvas, setWebcamVideo } from "./capture";
import { startAudio, setBusGain, setBusMute, getMasterDest } from "./audio";
import { syncFeedMute } from "./players";
import type { InputFeed } from "./feeds";
import type {
  AudioBusId,
  LogLevel,
  MixerSnapshot,
  TransitionJob,
  TransitionKind,
} from "./types";

let logSeq = 1;
let recChunks: Blob[] = [];
let recorder: MediaRecorder | null = null;
let recorderMime = "video/webm";

export interface MixerState {
  programId: string;
  previewId: string;
  overlays: [boolean, boolean, boolean, boolean];
  overlayAt: [number, number, number, number];
  overlayOut: [boolean, boolean, boolean, boolean];
  recording: boolean;
  streaming: boolean;
  transition: Exclude<TransitionKind, "cut">;
  durationMs: number;
  transitioning: TransitionJob | null;
  recStartedAt: number | null;
  streamStartedAt: number | null;
  showStartedAt: number;
  lowerThirdName: string;
  lowerThirdTitle: string;
  ticker: string;
  scoreHome: string;
  scoreAway: string;
  scoreHomeN: number;
  scoreAwayN: number;
  gains: Record<AudioBusId, number>;
  mutes: Record<AudioBusId, boolean>;
  logs: { id: number; t: number; level: LogLevel; msg: string }[];
  audioArmed: boolean;
  webcamReady: boolean;
  lastDownload: string | null;
  feeds: Record<string, InputFeed>;
}

interface MixerActions {
  setPreview: (id: string) => void;
  cutTo: (id?: string) => void;
  auto: () => void;
  setTransition: (kind: Exclude<TransitionKind, "cut">) => void;
  setDuration: (ms: number) => void;
  toggleOverlay: (index: 0 | 1 | 2 | 3, on?: boolean) => void;
  applyGfxSample: (id: string) => void;
  applyScene: (id: string, take?: boolean) => void;
  setGain: (bus: AudioBusId, gain: number) => void;
  toggleMute: (bus: AudioBusId) => void;
  setLowerThird: (name: string, title: string) => void;
  setTicker: (text: string) => void;
  setScore: (
    partial: Partial<Pick<MixerState, "scoreHome" | "scoreAway" | "scoreHomeN" | "scoreAwayN">>,
  ) => void;
  log: (level: LogLevel, msg: string) => void;
  tick: () => void;
  armAudio: () => Promise<void>;
  armWebcam: () => Promise<void>;
  toggleRecord: () => Promise<void>;
  toggleStream: () => void;
  hydrate: (snap: MixerSnapshot) => void;
  snapshot: () => MixerSnapshot;
  setFeed: (inputId: string, feed: InputFeed) => void;
  clearFeed: (inputId: string) => void;
  setFeedStatus: (inputId: string, status: InputFeed["status"], error?: string) => void;
  setFeedPlayback: (inputId: string, playbackUrl: string) => void;
}

const defaultGains: Record<AudioBusId, number> = {
  cam1: 0.72,
  cam2: 0.4,
  cam4: 0.55,
  media: 0.35,
  master: 0.8,
};

const defaultMutes: Record<AudioBusId, boolean> = {
  cam1: false,
  cam2: false,
  cam4: false,
  media: false,
  master: false,
};

function snapshotOf(s: MixerState): MixerSnapshot {
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
    feeds: s.feeds,
  };
}

function pushLog(
  logs: MixerState["logs"],
  level: LogLevel,
  msg: string,
): MixerState["logs"] {
  return [...logs.slice(-79), { id: logSeq++, t: Date.now(), level, msg }];
}

function beginTransition(s: MixerState, kind: TransitionKind): Partial<MixerState> {
  const fromId = s.programId;
  const toId = s.previewId;
  const from = inputById(fromId);
  const to = inputById(toId);
  if (fromId === toId) {
    return { logs: pushLog(s.logs, "warn", "Preview and program are the same input") };
  }
  if (kind === "cut" || s.durationMs < 40) {
    return {
      programId: toId,
      previewId: fromId,
      transitioning: null,
      logs: pushLog(s.logs, "ok", `Cut  ${from?.name ?? fromId} → ${to?.name ?? toId}  PGM`),
    };
  }
  return {
    programId: toId,
    previewId: fromId,
    transitioning: {
      fromId,
      toId,
      kind,
      startedAt: Date.now(),
      durationMs: s.durationMs,
    },
    logs: pushLog(
      s.logs,
      "ok",
      `${kind[0]!.toUpperCase()}${kind.slice(1)}  ${s.durationMs}ms  ${from?.name} → ${to?.name}`,
    ),
  };
}

export const useMixer = create<MixerState & MixerActions>()(
  persist(
    (set, get) => ({
      programId: "cam1",
      previewId: "cam2",
      overlays: [false, true, false, false],
      overlayAt: [0, 0, 0, 0],
      overlayOut: [false, false, false, false],
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
      ticker:
        "ffmix-cli  ·  NIGHT DESK  ·  MANAMA  ·  LIVE PRODUCTION  ·  CUT  FADE  WIPE  SLIDE",
      scoreHome: "HOME",
      scoreAway: "AWAY",
      scoreHomeN: 2,
      scoreAwayN: 1,
      gains: { ...defaultGains },
      mutes: { ...defaultMutes },
      logs: [
        {
          id: logSeq++,
          t: Date.now(),
          level: "info",
          msg: "ffmix-cli 1.0.0  ·  Laravel Zero TUI  ·  type help",
        },
      ],
      audioArmed: false,
      webcamReady: false,
      lastDownload: null,
      feeds: {},

      setPreview: (id) => {
        const input = inputById(id);
        if (!input) return;
        set((s) => ({
          previewId: id,
          logs: pushLog(s.logs, "info", `Preview  ${input.name}  ${input.label}`),
        }));
        const s = get();
        syncFeedMute(s.programId, s.mutes.master);
      },

      cutTo: (id) => {
        if (id) {
          const input = inputById(id);
          if (!input) return;
          set((s) => ({
            previewId: id,
            ...beginTransition({ ...s, previewId: id }, "cut"),
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
          const overlays = [...s.overlays] as MixerState["overlays"];
          const overlayAt = [...s.overlayAt] as MixerState["overlayAt"];
          const overlayOut = [...s.overlayOut] as MixerState["overlayOut"];
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
            logs: pushLog(
              s.logs,
              want ? "ok" : "warn",
              `Overlay ${index + 1}  ${names[index]}  ${want ? "IN" : "OUT"}`,
            ),
          };
        });
      },

      applyGfxSample: (id) => {
        const sample = GFX_SAMPLES.find((g) => g.id === id);
        if (!sample) return;
        set((s) => {
          const overlays = [...s.overlays] as MixerState["overlays"];
          const overlayAt = [...s.overlayAt] as MixerState["overlayAt"];
          const overlayOut = [...s.overlayOut] as MixerState["overlayOut"];
          const now = Date.now();
          for (let i = 0; i < 4; i++) {
            const want = sample.overlays[i]!;
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
            logs: pushLog(s.logs, "ok", `GFX  ${sample.name}  ·  ${sample.hint}`),
          };
        });
      },

      applyScene: (id, take) => {
        const scene = SCENES.find((x) => x.id === id);
        if (!scene) return;
        set((s) => {
          const overlays = [...s.overlays] as MixerState["overlays"];
          const overlayAt = [...s.overlayAt] as MixerState["overlayAt"];
          const overlayOut = [...s.overlayOut] as MixerState["overlayOut"];
          const now = Date.now();
          for (let i = 0; i < 4; i++) {
            const want = scene.overlays[i]!;
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
          const next: MixerState = {
            ...s,
            previewId: scene.previewId,
            overlays,
            overlayAt,
            overlayOut,
            logs: pushLog(s.logs, "info", `Scene  ${scene.name}`),
          };
          if (take) return { ...next, ...beginTransition(next, s.transition) };
          return {
            previewId: next.previewId,
            overlays: next.overlays,
            overlayAt: next.overlayAt,
            overlayOut: next.overlayOut,
            logs: next.logs,
          };
        });
      },

      setGain: (bus, gain) => {
        const g = Math.min(1, Math.max(0, gain));
        set((s) => ({ gains: { ...s.gains, [bus]: g } }));
        setBusGain(bus, g);
      },

      toggleMute: (bus) => {
        set((s) => {
          const muted = !s.mutes[bus];
          setBusMute(bus, muted);
          if (bus === "master") syncFeedMute(s.programId, muted);
          return {
            mutes: { ...s.mutes, [bus]: muted },
            logs: pushLog(
              s.logs,
              muted ? "warn" : "ok",
              `${bus.toUpperCase()}  ${muted ? "MUTE" : "ON"}`,
            ),
          };
        });
      },

      setLowerThird: (name, title) => set({ lowerThirdName: name, lowerThirdTitle: title }),
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
          if (now - s.overlayAt[i] < OVERLAYS[i]!.outMs) continue;
          if (!gfxChanged) {
            overlays = [...overlays] as MixerState["overlays"];
            overlayOut = [...overlayOut] as MixerState["overlayOut"];
            gfxChanged = true;
          }
          overlays[i] = false;
          overlayOut[i] = false;
        }
        const job = s.transitioning;
        const transDone = Boolean(job && now >= job.startedAt + job.durationMs);
        if (!gfxChanged && !transDone) return;
        set({
          ...(gfxChanged ? { overlays, overlayOut } : {}),
          ...(transDone ? { transitioning: null } : {}),
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
            video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          const video = document.createElement("video");
          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;
          await video.play();
          setWebcamVideo(video);
          set({ webcamReady: true, previewId: "webcam" });
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
          const tracks = [
            ...vStream.getVideoTracks(),
            ...(dest ? dest.stream.getAudioTracks() : []),
          ];
          const mixed = new MediaStream(tracks);
          const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : MediaRecorder.isTypeSupported("video/webm")
              ? "video/webm"
              : "";
          recChunks = [];
          recorderMime = mime || "video/webm";
          recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : undefined);
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
            set({ lastDownload: url, recStartedAt: null });
          };
          recorder.start(400);
          set({ recording: true, recStartedAt: Date.now() });
          get().log("ok", "Record start  ·  Program bus");
        } catch {
          get().log("error", "Recorder unavailable");
        }
      },

      toggleStream: () => {
        const s = get();
        if (s.streaming) {
          set({ streaming: false, streamStartedAt: null });
          get().log("warn", "Stream stop  ·  Reverb ingest closed");
          return;
        }
        set({ streaming: true, streamStartedAt: Date.now() });
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
          feeds: snap.feeds ?? get().feeds,
        });
      },

      snapshot: () => snapshotOf(get()),

      setFeed: (inputId, feed) => {
        const input = inputById(inputId);
        if (!input) return;
        set((s) => ({
          feeds: { ...s.feeds, [inputId]: { ...feed, status: feed.status ?? "connecting" } },
          logs: pushLog(
            s.logs,
            "ok",
            `${input.name}  source  ${feed.label}  ${feed.youtubeId ?? feed.url}`,
          ),
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
            logs: pushLog(s.logs, "warn", `${input?.name ?? inputId}  source cleared`),
          };
        });
      },

      setFeedStatus: (inputId, status, error) => {
        set((s) => {
          const current = s.feeds[inputId];
          if (!current) return {};
          if (current.status === status && current.error === error) return {};
          return {
            feeds: {
              ...s.feeds,
              [inputId]: { ...current, status, error },
            },
          };
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
              error: undefined,
            },
          },
          logs: pushLog(s.logs, "ok", `${inputById(inputId)?.name ?? inputId}  RTMP playback set`),
        }));
      },
    }),
    {
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
        feeds: s.feeds,
      }),
    },
  ),
);

export function tallyFor(id: string): "program" | "preview" | "none" {
  const s = useMixer.getState();
  if (s.programId === id) return "program";
  if (s.previewId === id) return "preview";
  return "none";
}
