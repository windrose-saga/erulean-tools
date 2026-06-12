import { useMemo } from 'react';

import { useGameStore } from '../useGameStore';

export const usePrefab = (prefabId: string) => {
  const prefabs = useGameStore.use.prefabs();
  return prefabs[prefabId];
};

export const usePrefabs = () => {
  const prefabs = useGameStore.use.prefabs();
  return useMemo(
    () => Object.values(prefabs).sort((a, b) => a.name.localeCompare(b.name)),
    [prefabs],
  );
};
