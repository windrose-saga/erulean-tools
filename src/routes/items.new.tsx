import { createFileRoute } from '@tanstack/react-router';

import { CreateItem } from '../components/CreateItem';

export const Route = createFileRoute('/items/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateItem />;
}
