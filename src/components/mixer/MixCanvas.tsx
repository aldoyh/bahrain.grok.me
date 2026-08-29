import { useEffect, useRef } from "react";
import { setProgramCanvas } from "@/lib/mixer/capture";
import { drawBus, preloadInputs } from "@/lib/mixer/draw";
import { useMixer } from "@/lib/mixer/store";
import { cn, formatTc } from "@/lib/utils";

export function MixCanvas({
  which,
  className,
}: {
  which: "program" | "preview";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    preloadInputs();
    const canvas = ref.current;
    if (!canvas) return;
    if (which === "program") setProgramCanvas(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    const loop = () => {
      const dpr = Math.min(1.75, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(2, Math.floor(rect.width * dpr));
      const h = Math.max(2, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const s = useMixer.getState();
      s.tick();
      drawBus(ctx, w, h, which, s.snapshot(), Date.now(), formatTc(Date.now() - s.showStartedAt));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (which === "program") setProgramCanvas(null);
    };
  }, [which]);

  return <canvas ref={ref} className={cn("pointer-events-none block h-full w-full", className)} />;
}
