import { useEffect, useRef, useState } from "react";
import { useMixer } from "./store";
import type { MixerSnapshot } from "./types";

const CHANNEL = "ffmix-reverb";

type Wire = { v: 1; from: string; kind: "state"; state: MixerSnapshot };

export function useReverb(role: "director" | "floor", _name: string) {
  const selfRef = useRef(`ff-${Math.random().toString(36).slice(2, 8)}`);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL);
    const self = selfRef.current;
    setJoined(true);

    ch.onmessage = (ev: MessageEvent<Wire>) => {
      const msg = ev.data;
      if (!msg || msg.v !== 1 || msg.from === self) return;
      if (msg.kind === "state") useMixer.getState().hydrate(msg.state);
    };

    const unsub = useMixer.subscribe((s, prev) => {
      if (role !== "director") return;
      if (
        s.programId === prev.programId &&
        s.previewId === prev.previewId &&
        s.overlays === prev.overlays &&
        s.recording === prev.recording &&
        s.streaming === prev.streaming &&
        s.transitioning === prev.transitioning
      ) {
        return;
      }
      const wire: Wire = { v: 1, from: self, kind: "state", state: s.snapshot() };
      ch.postMessage(wire);
    });

    return () => {
      unsub();
      ch.close();
    };
  }, [role]);

  return {
    peers: [] as { connectionState: string }[],
    joined,
    selfId: selfRef.current,
    room: "local",
  };
}
