import { createFileRoute } from "@tanstack/react-router";
import DamageCalculator from "../screens/DamageCalculator";

export const Route = createFileRoute("/damage-calculator")({
  component: DamageCalculator,
});
