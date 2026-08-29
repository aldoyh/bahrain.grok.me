import { createFileRoute } from "@tanstack/react-router";
import { CliView } from "@/components/cli/CliView";

export const Route = createFileRoute("/cli")({ component: CliPage });

function CliPage() {
  return <CliView />;
}
