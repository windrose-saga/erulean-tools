import { useMemo } from "react";
import { useGameStore } from "../useGameStore";

export const useAugment = (augmentId: string) => {
  const augments = useGameStore.use.augments();
  return augments[augmentId];
};

export const useAugments = () => {
  const augments = useGameStore.use.augments();
  return useMemo(
    () =>
      Object.values(augments).sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [augments]
  );
};
