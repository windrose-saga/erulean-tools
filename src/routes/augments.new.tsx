import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/augments/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /augments/new!</div>;
}
