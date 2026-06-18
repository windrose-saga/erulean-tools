import { createFileRoute } from '@tanstack/react-router';

import { LevelClassDetail } from '../components/LevelClassDetail';

export const Route = createFileRoute('/exp-level-classes/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <LevelClassDetail kind="EXP" guid={id} />;
}
