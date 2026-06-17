import { createFileRoute } from '@tanstack/react-router';

import { LevelClassCreate } from '../components/LevelClassCreate';

export const Route = createFileRoute('/exp-level-classes/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LevelClassCreate kind="EXP" />;
}
