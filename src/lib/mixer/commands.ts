import { INPUTS, SCENES, inputById, inputByNum } from "./catalog";
import { SAMPLE_HLS, SAMPLE_YOUTUBE, SAMPLE_YOUTUBE_LIVE, parseFeedUrl, withPlayback } from "./feeds";
import { useMixer } from "./store";
import type { AudioBusId, TransitionKind } from "./types";

export interface CommandDef {
  name: string;
  usage: string;
  hint: string;
  aliases?: string[];
}

export const COMMANDS: CommandDef[] = [
  { name: "take", usage: "take", hint: "Cut preview to program", aliases: ["cut"] },
  { name: "auto", usage: "auto", hint: "Run selected transition", aliases: ["go"] },
  { name: "fade", usage: "fade [ms]", hint: "Crossfade to preview" },
  { name: "wipe", usage: "wipe [ms]", hint: "Wipe to preview" },
  { name: "slide", usage: "slide [ms]", hint: "Slide to preview" },
  { name: "zoom", usage: "zoom [ms]", hint: "Zoom to preview" },
  { name: "preview", usage: "preview <n|name>", hint: "Send input to preview", aliases: ["pvw"] },
  { name: "program", usage: "program <n|name>", hint: "Cut input to program", aliases: ["pgm"] },
  { name: "source", usage: "source <n> <url|yt|live|hls|clear>", hint: "Assign YouTube / HLS / RTMP", aliases: ["src"] },
  { name: "overlay", usage: "overlay <1-4> [on|off]", hint: "Toggle overlay channel", aliases: ["ov"] },
  { name: "scene", usage: "scene <name>", hint: "Load OBS-style scene" },
  { name: "mute", usage: "mute <bus>", hint: "Mute an audio bus" },
  { name: "unmute", usage: "unmute <bus>", hint: "Unmute an audio bus" },
  { name: "gain", usage: "gain <bus> <0-100>", hint: "Set bus fader" },
  { name: "record", usage: "record [start|stop]", hint: "Arm Program recorder", aliases: ["rec"] },
  { name: "stream", usage: "stream [start|stop]", hint: "Toggle Reverb ingest", aliases: ["live"] },
  { name: "audio", usage: "audio", hint: "Arm studio audio" },
  { name: "cam", usage: "cam", hint: "Enable local camera" },
  { name: "inputs", usage: "inputs", hint: "List inputs" },
  { name: "status", usage: "status", hint: "Show mixer status" },
  { name: "help", usage: "help", hint: "List commands", aliases: ["?"] },
  { name: "clear", usage: "clear", hint: "Clear TUI log" },
];

const aliasMap = new Map<string, string>();
for (const c of COMMANDS) {
  aliasMap.set(c.name, c.name);
  for (const a of c.aliases ?? []) aliasMap.set(a, c.name);
}

export function suggestCommands(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return COMMANDS;
  return COMMANDS.filter(
    (c) =>
      c.name.startsWith(s) ||
      c.usage.startsWith(s) ||
      (c.aliases ?? []).some((a) => a.startsWith(s)),
  );
}

function resolveInput(token?: string) {
  if (!token) return undefined;
  if (/^\d+$/.test(token)) return inputByNum(Number(token));
  const lower = token.toLowerCase();
  return (
    inputById(lower) ||
    INPUTS.find(
      (i) =>
        i.name.toLowerCase() === lower ||
        i.name.toLowerCase().replace(/\s+/g, "") === lower ||
        i.label.toLowerCase() === lower ||
        i.id === lower,
    )
  );
}

function resolveBus(token?: string): AudioBusId | undefined {
  if (!token) return undefined;
  const t = token.toLowerCase();
  const map: Record<string, AudioBusId> = {
    cam1: "cam1",
    cam2: "cam2",
    cam4: "cam4",
    media: "media",
    master: "master",
    mst: "master",
    "1": "cam1",
    "2": "cam2",
    "4": "cam4",
    "5": "media",
  };
  return map[t];
}

function applyDuration(ms?: string) {
  if (!ms) return;
  const n = Number(ms);
  if (Number.isFinite(n) && n >= 40 && n <= 5000) useMixer.getState().setDuration(n);
}

export function runCommand(line: string): string | null {
  const raw = line.trim();
  if (!raw) return null;
  const tokens = raw.split(/\s+/);
  const head = tokens[0]!.toLowerCase();
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
      mixer.setTransition(cmd as Exclude<TransitionKind, "cut">);
      mixer.auto();
      return null;
    case "preview": {
      const input = resolveInput(tokens[1]);
      if (!input) {
        mixer.log("error", "preview needs an input (1-9,0 or name)");
        return "Usage: preview <n|name>";
      }
      if (input.kind === "webcam" && !mixer.webcamReady) {
        void mixer.armWebcam();
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
        return current
          ? `${input.name}  ${current.label}  ${current.playbackUrl ?? current.url}  ${current.status}`
          : `${input.name}  (camera plate)`;
      }
      if (arg === "clear" || arg === "off" || arg === "none") {
        mixer.clearFeed(input.id);
        return null;
      }
      const sample =
        arg === "youtube" || arg === "yt"
          ? SAMPLE_YOUTUBE
          : arg === "live"
            ? SAMPLE_YOUTUBE_LIVE
            : arg === "hls"
              ? SAMPLE_HLS
              : null;
      const url = sample ?? tokens[2]!;
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
      const on = flag === "on" ? true : flag === "off" ? false : undefined;
      mixer.toggleOverlay((n - 1) as 0 | 1 | 2 | 3, on);
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
      if ((arg === "start" && !mixer.recording) || (arg === "stop" && mixer.recording) || !arg) {
        void mixer.toggleRecord();
      }
      return null;
    }
    case "stream": {
      const arg = tokens[1]?.toLowerCase();
      if (arg === "start" && mixer.streaming) return "Already live.";
      if (arg === "stop" && !mixer.streaming) return "Not streaming.";
      if ((arg === "start" && !mixer.streaming) || (arg === "stop" && mixer.streaming) || !arg) {
        mixer.toggleStream();
      }
      return null;
    }
    case "audio":
      void mixer.armAudio();
      return null;
    case "cam":
      void mixer.armWebcam();
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
    default:
      return null;
  }
}
