import { createFileRoute } from "@tanstack/react-router";
import { TallyView } from "@/components/tally/TallyView";

export const Route = createFileRoute("/tally")({ component: TallyPage });

function TallyPage() {
  return <TallyView />;
}
