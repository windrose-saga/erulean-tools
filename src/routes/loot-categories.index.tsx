import { createFileRoute } from '@tanstack/react-router';

import { LootCategoryManager } from '../components/LootCategoryManager';
import { withLoadingGate } from '../utils/withLoadingGate';

export const Route = createFileRoute('/loot-categories/')({
  component: withLoadingGate(LootCategoryManager),
});
