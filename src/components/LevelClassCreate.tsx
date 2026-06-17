import React from 'react';

import { IntLevelClassForm } from './forms/IntLevelClassForm';
import { VectorLevelClassForm } from './forms/VectorLevelClassForm';
import { LEVEL_CLASS_CONFIG } from './levelClassConfig';

import { NEW_INT_LEVEL_CLASS, NEW_VECTOR_LEVEL_CLASS } from '../constants/levelClass';
import {
  useDungeonGridLevelClasses,
  useExpLevelClasses,
  useGridLevelClasses,
  usePvLevelClasses,
} from '../store/getters/levelClass';
import { useGameStore } from '../store/useGameStore';
import { LevelClassKind } from '../types/levelClass';

export const LevelClassCreate: React.FC<{ kind: LevelClassKind }> = ({ kind }) => {
  const config = LEVEL_CLASS_CONFIG[kind];
  const guid = React.useMemo(() => crypto.randomUUID(), []);

  const expList = useExpLevelClasses();
  const pvList = usePvLevelClasses();
  const gridList = useGridLevelClasses();
  const dungeonList = useDungeonGridLevelClasses();

  const setExp = useGameStore.use.setExpLevelClass();
  const setPv = useGameStore.use.setPvLevelClass();
  const setGrid = useGameStore.use.setGridLevelClass();
  const setDungeon = useGameStore.use.setDungeonGridLevelClass();

  if (config.variant === 'int') {
    const others = kind === 'EXP' ? expList : pvList;
    const onSave = kind === 'EXP' ? setExp : setPv;
    return (
      <IntLevelClassForm
        levelClass={{ ...NEW_INT_LEVEL_CLASS, guid }}
        others={others}
        onSave={onSave}
        routeBase={config.routeBase}
        levelLabel={config.levelLabel}
        warn={config.warn}
      />
    );
  }

  const others = kind === 'GRID' ? gridList : dungeonList;
  const onSave = kind === 'GRID' ? setGrid : setDungeon;
  return (
    <VectorLevelClassForm
      levelClass={{ ...NEW_VECTOR_LEVEL_CLASS, guid }}
      others={others}
      onSave={onSave}
      routeBase={config.routeBase}
      levelLabel={config.levelLabel}
    />
  );
};
