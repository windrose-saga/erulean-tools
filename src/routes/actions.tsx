import { createFileRoute } from '@tanstack/react-router';

import { ActionList } from '../components/ActionList';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/actions')({
  component: withLoadingGate(ActionList),
});
