import { createFileRoute } from '@tanstack/react-router';

import { CreateAugment } from '../components/CreateAugment';

export const Route = createFileRoute('/augments/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateAugment />;
}
