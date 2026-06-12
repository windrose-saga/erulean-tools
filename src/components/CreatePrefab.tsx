import React from 'react';

import { DungeonPrefabForm } from './forms/DungeonPrefabForm';

import { DEFAULT_DUNGEON_PREFAB } from '../constants/dungeonPrefab';

export const CreatePrefab: React.FC = () => {
  const prefab = React.useMemo(
    () => ({ ...DEFAULT_DUNGEON_PREFAB, guid: crypto.randomUUID() }),
    [],
  );

  return <DungeonPrefabForm prefab={prefab} />;
};
