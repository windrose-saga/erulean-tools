import * as React from 'react';

import { TagMatrix } from './TagMatrix';

import { useItems } from '../store/getters/item';
import { useActiveLootCategories } from '../store/getters/vocab';
import { useGameStore } from '../store/useGameStore';
import { Item } from '../types/item';

export const ItemLootCategoryMatrix = () => {
  const items = useItems();
  const categories = useActiveLootCategories();
  const setItem = useGameStore.use.setItem();
  const addLootCategory = useGameStore.use.addLootCategory();

  const onToggle = React.useCallback(
    (item: Item, category: string, next: boolean) => {
      const loot_categories = next
        ? [...item.loot_categories, category]
        : item.loot_categories.filter((c) => c !== category);
      setItem({ ...item, loot_categories });
    },
    [setItem],
  );

  return (
    <TagMatrix
      rows={items}
      columns={categories}
      noun="category"
      getValues={(item) => item.loot_categories}
      onToggle={onToggle}
      onAddColumn={addLootCategory}
    />
  );
};
