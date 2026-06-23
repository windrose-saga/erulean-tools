import { createFileRoute } from '@tanstack/react-router';

import { LevelClassDetail } from '../components/LevelClassDetail';

export const Route = createFileRoute('/generator-classes/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <LevelClassDetail kind="GENERATOR" guid={id} />;
}
