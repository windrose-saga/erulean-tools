import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { LEVEL_CLASS_CONFIG } from './levelClassConfig';
import { List } from './List';

import {
  useDungeonGridLevelClasses,
  useExpLevelClasses,
  useGeneratorClasses,
  useGridLevelClasses,
  usePvLevelClasses,
} from '../store/getters/levelClass';
import {
  GeneratorClass,
  IntLevelClass,
  LevelClassKind,
  VectorLevelClass,
} from '../types/levelClass';
import { Column } from '../types/list';

type AnyLevelClass = IntLevelClass | VectorLevelClass | GeneratorClass;

const columns: Column<AnyLevelClass>[] = [
  { name: 'Name', field: 'name' },
  { name: 'ID', field: 'id' },
];

const searchFields: (keyof AnyLevelClass)[] = ['name', 'id'];

export const LevelClassList: React.FC<{ kind: LevelClassKind }> = ({ kind }) => {
  const navigate = useNavigate();
  const config = LEVEL_CLASS_CONFIG[kind];

  const byKind: Record<LevelClassKind, AnyLevelClass[]> = {
    EXP: useExpLevelClasses(),
    PV: usePvLevelClasses(),
    GRID: useGridLevelClasses(),
    DUNGEON_GRID: useDungeonGridLevelClasses(),
    GENERATOR: useGeneratorClasses(),
  };

  const onRowClick = React.useCallback(
    (item: AnyLevelClass) => {
      navigate({ to: `/${config.routeBase}/${item.guid}` });
    },
    [navigate, config.routeBase],
  );

  return (
    <List
      items={byKind[kind]}
      columns={columns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      objectCreationType={config.objectCreationType}
    />
  );
};
