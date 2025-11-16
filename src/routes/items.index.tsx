import { createFileRoute } from '@tanstack/react-router';

import { ItemList } from '../components/ItemList';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/items/')({
  component: withLoadingGate(ItemList),
});
