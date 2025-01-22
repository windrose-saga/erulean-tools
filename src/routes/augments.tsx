import { createFileRoute } from "@tanstack/react-router";
import { withLoadingGate } from "../utils/withLoadingGate";
import { AugmentList } from "../components/AugmentList";

export const Route = createFileRoute("/augments")({
  component: withLoadingGate(AugmentList),
});
