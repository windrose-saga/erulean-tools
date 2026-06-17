import { useMemo } from 'react';

import { useGameStore } from '../useGameStore';

// Active = present in the ordered list and not tombstoned. The UI (MultiSelects, management
// pages' main list) consumes the active view; the full ordered list still drives enum codegen.
export const useActiveLootCategories = () => {
  const ids = useGameStore.use.lootCategoryIds();
  const removed = useGameStore.use.removedLootCategoryIds();
  return useMemo(() => ids.filter((name) => !removed.includes(name)), [ids, removed]);
};

export const useActiveGeneratorTags = () => {
  const ids = useGameStore.use.generatorTagIds();
  const removed = useGameStore.use.removedGeneratorTagIds();
  return useMemo(() => ids.filter((name) => !removed.includes(name)), [ids, removed]);
};
