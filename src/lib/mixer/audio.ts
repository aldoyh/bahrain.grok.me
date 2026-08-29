import type { AudioBusId } from "./types";

const BUS_IDS: AudioBusId[] = ["cam1", "cam2", "cam4", "media", "master"];

interface BusNodes {
  gain: GainNode;
  analyser: AnalyserNode;
  filter: BiquadFilterNode;
  source: AudioBufferSourceNode;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let masterAnalyser: AnalyserNode | null = null;
let dest: MediaStreamAudioDestinationNode | null = null;
const buses = new Map<AudioBusId, BusNodes>();
const meterBuf = new Uint8Array(64);
let presenceTimer: number | null = null;
let presenceBus: AudioBusId | null = null;

function brownNoise(ac: AudioContext, seconds = 2) {
  const length = ac.sampleRate * seconds;
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export async function startAudio(
  gains: Record<AudioBusId, number>,
  mutes: Record<AudioBusId, boolean>,
) {
  if (ctx) return;
  const ac = new AudioContext();
  if (ac.state === "suspended") await ac.resume();
  const noise = brownNoise(ac);
  const m = ac.createGain();
  m.gain.value = mutes.master ? 0 : gains.master;
  const analyser = ac.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.7;
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
    g.gain.value = mutes[id] ? 0 : gains[id] * 0.18;
    const a = ac.createAnalyser();
    a.fftSize = 256;
    a.smoothingTimeConstant = 0.65;
    src.connect(filter);
    filter.connect(g);
    g.connect(a);
    a.connect(m);
    src.start();
    buses.set(id, { gain: g, analyser: a, filter, source: src });
  }

  ctx = ac;
  master = m;
  masterAnalyser = analyser;
  dest = out;
}

export function stopAudio() {
  if (presenceTimer) window.clearInterval(presenceTimer);
  presenceTimer = null;
  void ctx?.close();
  ctx = null;
  master = null;
  masterAnalyser = null;
  dest = null;
  buses.clear();
}

export function setBusGain(bus: AudioBusId, gain: number) {
  if (bus === "master") {
    if (master) master.gain.setTargetAtTime(gain, ctx?.currentTime ?? 0, 0.05);
    return;
  }
  const node = buses.get(bus);
  if (!node || !ctx) return;
  const presence = presenceBus === bus ? 1 : 0.45;
  node.gain.gain.setTargetAtTime(gain * 0.18 * presence, ctx.currentTime, 0.08);
}

export function setBusMute(bus: AudioBusId, muted: boolean) {
  if (bus === "master") {
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx?.currentTime ?? 0, 0.04);
    return;
  }
  const node = buses.get(bus);
  if (!node || !ctx) return;
  node.gain.gain.setTargetAtTime(muted ? 0 : 0.12, ctx.currentTime, 0.04);
}

export function setPresence(bus: Exclude<AudioBusId, "master"> | null) {
  presenceBus = bus;
}

export function getMasterDest() {
  return dest;
}

function rms(analyser: AnalyserNode) {
  analyser.getByteTimeDomainData(meterBuf);
  let sum = 0;
  for (let i = 0; i < meterBuf.length; i++) {
    const v = (meterBuf[i]! - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / meterBuf.length);
}

export function readMeters(): Record<AudioBusId, number> {
  const out: Record<AudioBusId, number> = {
    cam1: 0,
    cam2: 0,
    cam4: 0,
    media: 0,
    master: 0,
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
