import { useEffect } from "react";
import { useMixer } from "./store";

export function useMixerPersist() {
  useEffect(() => {
    void useMixer.persist.rehydrate();
  }, []);
}
