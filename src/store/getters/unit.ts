import { useMemo } from "react";
import { useGameStore } from "../useGameStore";

export const useUnit = (unitId: string) => {
  const units = useGameStore.use.units();
  return units[unitId];
};

export const useUnits = () => {
  const units = useGameStore.use.units();
  return useMemo(
    () =>
      Object.values(units).sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
    [units]
  );
};
