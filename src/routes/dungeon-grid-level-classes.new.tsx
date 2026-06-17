import { createFileRoute } from '@tanstack/react-router';

import { LevelClassCreate } from '../components/LevelClassCreate';

export const Route = createFileRoute('/dungeon-grid-level-classes/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LevelClassCreate kind="DUNGEON_GRID" />;
}
