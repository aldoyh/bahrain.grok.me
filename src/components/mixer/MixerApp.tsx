import { useEffect, useState } from "react";
import { AudioLines, Cable, Captions, LayoutGrid, SquareTerminal } from "lucide-react";
import { inputById } from "@/lib/mixer/catalog";
import { setPresence } from "@/lib/mixer/audio";
import { useReverb } from "@/lib/mixer/reverb";
import { useMixer } from "@/lib/mixer/store";
import { cn } from "@/lib/utils";
import { AudioBoard } from "./AudioBoard";
import { ControlSurface, TakeBar } from "./ControlSurface";
import { GfxEditor } from "./GfxEditor";
import { InputGrid, SourceBoard } from "./InputGrid";
import { Monitors } from "./Monitors";
import { TopBar } from "./TopBar";
import { TuiDock } from "./TuiDock";
import { useHotkeys } from "./useHotkeys";

const PANELS = [
  { id: "mix" as const, label: "Mix", Icon: LayoutGrid },
  { id: "gfx" as const, label: "GFX", Icon: Captions },
  { id: "src" as const, label: "Src", Icon: Cable },
  { id: "aud" as const, label: "Aud", Icon: AudioLines },
  { id: "tui" as const, label: "TUI", Icon: SquareTerminal },
];

export function MixerApp() {
  const reverb = useReverb("director", "Director");
  useHotkeys();
  const [panel, setPanel] = useState<(typeof PANELS)[number]["id"]>("mix");

  useEffect(() => {
    return useMixer.subscribe((s) => {
      const bus = inputById(s.programId)?.bus ?? "media";
      setPresence(bus);
    });
  }, []);

  const connected = reverb.joined ? "on" : "local";
  const peerCount = reverb.peers.filter((p) => p.connectionState === "connected").length;

  return (
    <div className="mixer-app flex min-h-dvh flex-col bg-bg text-fg max-lg:h-dvh max-lg:max-h-dvh max-lg:overflow-hidden">
      <TopBar reverbLabel={connected} peers={peerCount} />
      <div className="mixer-shell flex min-h-0 flex-1 max-lg:flex-row">
        <div className="mixer-main mx-auto flex min-h-0 min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-2 p-2 max-lg:overflow-hidden sm:p-3 lg:gap-3 lg:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="mixer-stage flex shrink-0 flex-col gap-1.5 lg:gap-3">
            <Monitors />
            <TakeBar className="lg:hidden" />
          </div>

          <div className="mixer-desk flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:overflow-visible">
            <div
              className={cn(
                "flex shrink-0 flex-col gap-1.5 lg:gap-3",
                panel === "mix"
                  ? "max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto"
                  : "max-lg:hidden",
              )}
            >
              <ControlSurface />
              <InputGrid />
            </div>

            <div
              className={cn(
                "grid min-h-0 flex-1 gap-2 lg:grid-cols-[minmax(0,1fr)_18rem]",
                panel === "mix" || panel === "src"
                  ? "max-lg:hidden"
                  : "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:overflow-hidden",
              )}
            >
              <div
                className={cn(
                  "min-h-0 lg:block",
                  panel === "gfx"
                    ? "max-lg:block max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-y-auto"
                    : "max-lg:hidden",
                )}
              >
                <GfxEditor />
              </div>
              <div
                className={cn(
                  "min-h-0 overflow-auto lg:block",
                  panel === "aud" ? "max-lg:block max-lg:min-h-0 max-lg:flex-1" : "max-lg:hidden",
                )}
              >
                <AudioBoard />
              </div>
              <div
                className={cn(
                  "min-h-0 lg:col-span-2",
                  panel === "tui"
                    ? "flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col"
                    : "max-lg:hidden lg:block",
                )}
              >
                <TuiDock className="max-lg:h-full max-lg:min-h-0" />
              </div>
            </div>

            <div
              className={cn(
                "min-h-0",
                panel === "src" ? "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col" : "hidden",
              )}
            >
              <SourceBoard />
            </div>
          </div>
        </div>

        <nav
          className="mixer-rail flex shrink-0 flex-col border-l border-border bg-surface lg:hidden"
          aria-label="Mixer panels"
        >
          {PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPanel(p.id)}
              className={cn(
                "relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 font-mono text-[10px] tracking-wide",
                panel === p.id ? "text-fg" : "text-muted",
              )}
            >
              {panel === p.id ? (
                <span className="absolute inset-y-3 left-0 w-px bg-fg" />
              ) : null}
              <p.Icon className="size-4" strokeWidth={1.75} />
              {p.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
