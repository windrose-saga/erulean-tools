import { VocabManager } from './VocabManager';

import { useGameStore } from '../store/useGameStore';

export const LootCategoryManager = () => {
  const lootCategoryIds = useGameStore.use.lootCategoryIds();
  const removedLootCategoryIds = useGameStore.use.removedLootCategoryIds();
  const addLootCategory = useGameStore.use.addLootCategory();
  const removeLootCategory = useGameStore.use.removeLootCategory();
  const renameLootCategory = useGameStore.use.renameLootCategory();

  const activeNames = lootCategoryIds.filter((name) => !removedLootCategoryIds.includes(name));

  return (
    <VocabManager
      title="Loot Categories"
      noun="category"
      activeNames={activeNames}
      removedNames={removedLootCategoryIds}
      onAdd={addLootCategory}
      onRemove={removeLootCategory}
      onRename={renameLootCategory}
    />
  );
};
