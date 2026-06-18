import { createFileRoute } from '@tanstack/react-router';

import { ItemLootCategoryMatrix } from '../components/ItemLootCategoryMatrix';
import { LootCategoryManager } from '../components/LootCategoryManager';
import { VocabViewSwitcher } from '../components/VocabViewSwitcher';
import { withLoadingGate } from '../utils/withLoadingGate';

const LootCategoriesPage = () => (
  <VocabViewSwitcher manageView={<LootCategoryManager />} matrixView={<ItemLootCategoryMatrix />} />
);

export const Route = createFileRoute('/loot-categories/')({
  component: withLoadingGate(LootCategoriesPage),
});
