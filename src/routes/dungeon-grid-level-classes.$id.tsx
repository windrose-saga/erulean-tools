import { createFileRoute } from '@tanstack/react-router';

import { LevelClassDetail } from '../components/LevelClassDetail';

export const Route = createFileRoute('/dungeon-grid-level-classes/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <LevelClassDetail kind="DUNGEON_GRID" guid={id} />;
}
