import { useGameStore } from "../useGameStore";
import { useMemo } from "react";

export const useAction = (actionId: string) => {
  const actions = useGameStore.use.actions();
  return actions[actionId];
};

export const useActions = () => {
  const actions = useGameStore.use.actions();
  return useMemo(
    () =>
      Object.values(actions).sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [actions]
  );
};
