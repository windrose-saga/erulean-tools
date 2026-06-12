import { createFileRoute } from '@tanstack/react-router';

import { PrefabDetail } from '../components/PrefabDetail';

export const Route = createFileRoute('/prefabs/$prefabId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { prefabId } = Route.useParams();

  return <PrefabDetail prefabId={prefabId} />;
}
