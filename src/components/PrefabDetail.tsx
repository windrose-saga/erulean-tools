import React from 'react';

import { DungeonPrefabForm } from './forms/DungeonPrefabForm';

import { usePrefab } from '../store/getters/prefab';

export const PrefabDetail: React.FC<{ prefabId: string }> = ({ prefabId }) => {
  const prefab = usePrefab(prefabId);

  return <DungeonPrefabForm prefab={prefab} />;
};
