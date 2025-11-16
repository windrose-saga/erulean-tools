import { useMemo } from 'react';

import { useGameStore } from '../useGameStore';

export const useItem = (itemId: string) => {
  const items = useGameStore.use.items();
  return items[itemId];
};

export const useItems = () => {
  const items = useGameStore.use.items();
  return useMemo(
    () => Object.values(items).sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );
};
