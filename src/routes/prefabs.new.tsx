import { createFileRoute } from '@tanstack/react-router';

import { CreatePrefab } from '../components/CreatePrefab';

export const Route = createFileRoute('/prefabs/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreatePrefab />;
}
