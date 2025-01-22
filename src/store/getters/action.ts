import { useMemo } from 'react';

import { useGameStore } from '../useGameStore';

export const useAction = (actionId: string) => {
  const actions = useGameStore.use.actions();
  return actions[actionId];
};

export const useActions = () => {
  const actions = useGameStore.use.actions();
  return useMemo(
    () => Object.values(actions).sort((a, b) => a.name.localeCompare(b.name)),
    [actions],
  );
};
