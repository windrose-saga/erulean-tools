import { createFileRoute } from "@tanstack/react-router";
import { UnitList } from "../components/UnitList";
import { withLoadingGate } from "../utils/withLoadingGate";

export const Route = createFileRoute("/units")({
  component: withLoadingGate(UnitList),
});
