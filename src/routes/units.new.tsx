import { createFileRoute } from '@tanstack/react-router';

import { CreateUnit } from '../components/CreateUnit';

export const Route = createFileRoute('/units/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateUnit />;
}
