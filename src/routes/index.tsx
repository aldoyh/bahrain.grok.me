import { createFileRoute } from "@tanstack/react-router";
import { MixerApp } from "@/components/mixer/MixerApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MixerApp />;
}
