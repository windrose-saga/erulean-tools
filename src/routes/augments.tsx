import { createFileRoute } from '@tanstack/react-router';

import { AugmentList } from '../components/AugmentList';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/augments')({
  component: withLoadingGate(AugmentList),
});
