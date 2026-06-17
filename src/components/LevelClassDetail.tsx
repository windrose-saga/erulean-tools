import React from 'react';

import { IntLevelClassForm } from './forms/IntLevelClassForm';
import { VectorLevelClassForm } from './forms/VectorLevelClassForm';
import { LEVEL_CLASS_CONFIG } from './levelClassConfig';

import {
  useDungeonGridLevelClass,
  useDungeonGridLevelClasses,
  useExpLevelClass,
  useExpLevelClasses,
  useGridLevelClass,
  useGridLevelClasses,
  usePvLevelClass,
  usePvLevelClasses,
} from '../store/getters/levelClass';
import { useGameStore } from '../store/useGameStore';
import { LevelClassKind } from '../types/levelClass';

export const LevelClassDetail: React.FC<{ kind: LevelClassKind; guid: string }> = ({
  kind,
  guid,
}) => {
  const config = LEVEL_CLASS_CONFIG[kind];

  const exp = useExpLevelClass(guid);
  const pv = usePvLevelClass(guid);
  const grid = useGridLevelClass(guid);
  const dungeon = useDungeonGridLevelClass(guid);

  const expList = useExpLevelClasses();
  const pvList = usePvLevelClasses();
  const gridList = useGridLevelClasses();
  const dungeonList = useDungeonGridLevelClasses();

  const setExp = useGameStore.use.setExpLevelClass();
  const setPv = useGameStore.use.setPvLevelClass();
  const setGrid = useGameStore.use.setGridLevelClass();
  const setDungeon = useGameStore.use.setDungeonGridLevelClass();

  if (config.variant === 'int') {
    const value = kind === 'EXP' ? exp : pv;
    const others = kind === 'EXP' ? expList : pvList;
    const onSave = kind === 'EXP' ? setExp : setPv;
    return (
      <IntLevelClassForm
        levelClass={value}
        others={others}
        onSave={onSave}
        routeBase={config.routeBase}
        levelLabel={config.levelLabel}
        warn={config.warn}
      />
    );
  }

  const value = kind === 'GRID' ? grid : dungeon;
  const others = kind === 'GRID' ? gridList : dungeonList;
  const onSave = kind === 'GRID' ? setGrid : setDungeon;
  return (
    <VectorLevelClassForm
      levelClass={value}
      others={others}
      onSave={onSave}
      routeBase={config.routeBase}
      levelLabel={config.levelLabel}
    />
  );
};
