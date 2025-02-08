import { createFileRoute } from '@tanstack/react-router';

import { AugmentDetail } from '../components/AugmentDetail';

export const Route = createFileRoute('/augments/$augmentId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { augmentId } = Route.useParams();

  return <AugmentDetail augmentId={augmentId} />;
}
