import { createFileRoute } from "@tanstack/react-router";
import DamageCalculator from "../screens/DamageCalculator";
import { withLoadingGate } from "../utils/withLoadingGate";

export const Route = createFileRoute("/damage-calculator")({
  component: withLoadingGate(DamageCalculator),
});
