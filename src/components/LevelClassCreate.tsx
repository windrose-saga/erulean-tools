import React from 'react';

import { GeneratorClassForm } from './forms/GeneratorClassForm';
import { IntLevelClassForm } from './forms/IntLevelClassForm';
import { VectorLevelClassForm } from './forms/VectorLevelClassForm';
import { LEVEL_CLASS_CONFIG } from './levelClassConfig';

import {
  NEW_GENERATOR_CLASS,
  NEW_INT_LEVEL_CLASS,
  NEW_VECTOR_LEVEL_CLASS,
} from '../constants/levelClass';
import {
  useDungeonGridLevelClasses,
  useExpLevelClasses,
  useGeneratorClasses,
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
  const generatorList = useGeneratorClasses();

  const setExp = useGameStore.use.setExpLevelClass();
  const setPv = useGameStore.use.setPvLevelClass();
  const setGrid = useGameStore.use.setGridLevelClass();
  const setDungeon = useGameStore.use.setDungeonGridLevelClass();
  const setGenerator = useGameStore.use.setGeneratorClass();

  if (config.variant === 'generator') {
    return (
      <GeneratorClassForm
        generatorClass={{ ...NEW_GENERATOR_CLASS, guid }}
        others={generatorList}
        onSave={setGenerator}
        routeBase={config.routeBase}
      />
    );
  }

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
        blockOnWarning={config.blockOnWarning}
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
      withMaxUnits={config.maxUnits}
    />
  );
};
