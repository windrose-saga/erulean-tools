import { createFileRoute } from '@tanstack/react-router';

import { ActionDetail } from '../components/ActionDetail';

export const Route = createFileRoute('/actions/$actionId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { actionId } = Route.useParams();

  return <ActionDetail actionId={actionId} />;
}
