import { useMemo } from 'react';

import { useGameStore } from '../useGameStore';

export const useExpLevelClass = (guid: string) => {
  const classes = useGameStore.use.expLevelClasses();
  return classes[guid];
};

export const useExpLevelClasses = () => {
  const classes = useGameStore.use.expLevelClasses();
  return useMemo(
    () => Object.values(classes).sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  );
};

export const usePvLevelClass = (guid: string) => {
  const classes = useGameStore.use.pvLevelClasses();
  return classes[guid];
};

export const usePvLevelClasses = () => {
  const classes = useGameStore.use.pvLevelClasses();
  return useMemo(
    () => Object.values(classes).sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  );
};

export const useGridLevelClass = (guid: string) => {
  const classes = useGameStore.use.gridLevelClasses();
  return classes[guid];
};

export const useGridLevelClasses = () => {
  const classes = useGameStore.use.gridLevelClasses();
  return useMemo(
    () => Object.values(classes).sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  );
};

export const useDungeonGridLevelClass = (guid: string) => {
  const classes = useGameStore.use.dungeonGridLevelClasses();
  return classes[guid];
};

export const useDungeonGridLevelClasses = () => {
  const classes = useGameStore.use.dungeonGridLevelClasses();
  return useMemo(
    () => Object.values(classes).sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  );
};
