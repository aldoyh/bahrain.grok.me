import { useEffect } from "react";
import { inputByNum } from "@/lib/mixer/catalog";
import { useMixer } from "@/lib/mixer/store";

export function useHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.isContentEditable;

      if (e.key === "/" || e.key === "`") {
        if (!typing) {
          e.preventDefault();
          document.getElementById("ffmix-prompt")?.focus();
        }
        return;
      }
      if (e.key === "Escape") {
        (el as HTMLInputElement | null)?.blur?.();
        return;
      }
      if (typing) return;

      if (e.key >= "0" && e.key <= "9") {
        const input = inputByNum(Number(e.key));
        if (!input) return;
        if (input.kind === "webcam") void useMixer.getState().armWebcam();
        else useMixer.getState().setPreview(input.id);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        useMixer.getState().cutTo();
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        useMixer.getState().auto();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        void useMixer.getState().toggleRecord();
        return;
      }
      if (e.key === "l" || e.key === "L") {
        useMixer.getState().toggleStream();
        return;
      }
      if (e.key === "F1") {
        e.preventDefault();
        useMixer.getState().toggleOverlay(0);
      }
      if (e.key === "F2") {
        e.preventDefault();
        useMixer.getState().toggleOverlay(1);
      }
      if (e.key === "F3") {
        e.preventDefault();
        useMixer.getState().toggleOverlay(2);
      }
      if (e.key === "F4") {
        e.preventDefault();
        useMixer.getState().toggleOverlay(3);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
