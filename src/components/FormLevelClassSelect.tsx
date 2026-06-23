import * as React from 'react';
import { FieldValues, Path } from 'react-hook-form';

import LabledSelectWithDetail from './LabledSelectWithDetail';
import { LEVEL_CLASS_CONFIG } from './levelClassConfig';

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

export interface FormLevelClassSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  kind: LevelClassKind;
}

const FormLevelClassSelect = <T extends FieldValues>({
  label,
  id,
  kind,
}: FormLevelClassSelectProps<T>) => {
  const config = LEVEL_CLASS_CONFIG[kind];

  const byKind: Record<LevelClassKind, Array<IntLevelClass | VectorLevelClass | GeneratorClass>> = {
    EXP: useExpLevelClasses(),
    PV: usePvLevelClasses(),
    GRID: useGridLevelClasses(),
    DUNGEON_GRID: useDungeonGridLevelClasses(),
    GENERATOR: useGeneratorClasses(),
  };
  const list = byKind[kind];

  const options = React.useMemo(
    () => list.map((levelClass) => ({ name: levelClass.name, value: levelClass.guid })),
    [list],
  );

  return (
    <LabledSelectWithDetail id={id} label={label} options={options} pathBase={config.routeBase} />
  );
};

export default FormLevelClassSelect;
