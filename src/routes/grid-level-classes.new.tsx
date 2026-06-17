import { createFileRoute } from '@tanstack/react-router';

import { LevelClassCreate } from '../components/LevelClassCreate';

export const Route = createFileRoute('/grid-level-classes/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LevelClassCreate kind="GRID" />;
}
