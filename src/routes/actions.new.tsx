import { createFileRoute } from '@tanstack/react-router';

import { CreateAction } from '../components/CreateAction';

export const Route = createFileRoute('/actions/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateAction />;
}
