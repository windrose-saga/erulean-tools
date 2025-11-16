import { createFileRoute } from '@tanstack/react-router';

import { ItemDetail } from '../components/ItemDetail';

export const Route = createFileRoute('/items/$itemId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();

  return <ItemDetail itemId={itemId} />;
}
