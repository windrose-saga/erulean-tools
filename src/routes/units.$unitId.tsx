import { createFileRoute } from '@tanstack/react-router';

import { UnitDetail } from '../components/UnitDetail';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/units/$unitId')({
  component: withLoadingGate(RouteComponent),
});

function RouteComponent() {
  const { unitId } = Route.useParams();

  return <UnitDetail unitId={unitId} />;
}
