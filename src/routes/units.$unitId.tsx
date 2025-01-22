import { createFileRoute } from "@tanstack/react-router";
import { UnitDetail } from "../components/UnitDetail";

export const Route = createFileRoute("/units/$unitId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { unitId } = Route.useParams();

  return <UnitDetail unitId={unitId} />;
}
