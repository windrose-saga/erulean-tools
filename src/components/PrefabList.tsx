import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { usePrefabs } from '../store/getters/prefab';
import { DungeonPrefab } from '../types/dungeonPrefab';
import { Column } from '../types/list';

const prefabColumns: Column<DungeonPrefab>[] = [
  { name: 'Name', field: 'name' },
  { name: 'ID', field: 'id' },
];

const searchFields: (keyof DungeonPrefab)[] = ['name', 'id'];

export const PrefabList = () => {
  const navigate = useNavigate();
  const prefabs = usePrefabs();
  const onRowClick = React.useCallback(
    (prefab: DungeonPrefab) => {
      navigate({ to: '/prefabs/$prefabId', params: { prefabId: prefab.guid } });
    },
    [navigate],
  );
  return (
    <List
      items={prefabs}
      columns={prefabColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      objectCreationType="prefab"
    />
  );
};
