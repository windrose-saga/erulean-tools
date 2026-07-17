import { LevelClassKind } from '../types/levelClass';

export type LevelClassVariant = 'int' | 'vector' | 'generator';

export type LevelClassConfigEntry = {
  routeBase: string;
  title: string;
  levelLabel: string;
  variant: LevelClassVariant;
  objectCreationType:
    | 'expLevelClass'
    | 'pvLevelClass'
    | 'gridLevelClass'
    | 'dungeonGridLevelClass'
    | 'generatorClass';
  warn?: (levels: number[]) => string | null;
  blockOnWarning?: boolean;
  // Vector classes only: also edit the parallel per-level `max_units` cap curve.
  maxUnits?: boolean;
};

export const expWarn = (levels: number[]): string | null => {
  if (levels.some((value) => value < 0)) return 'Experience values should be non-negative.';
  const monotonic = levels.every((value, index) => index === 0 || value > levels[index - 1]);
  return monotonic ? null : 'Experience should strictly increase from one level to the next.';
};

const pvWarn = (levels: number[]): string | null =>
  levels.some((value) => value <= 0) ? 'Point value limits should be positive.' : null;

export const LEVEL_CLASS_CONFIG: Record<LevelClassKind, LevelClassConfigEntry> = {
  EXP: {
    routeBase: 'exp-level-classes',
    title: 'EXP Level Classes',
    levelLabel: 'Experience',
    variant: 'int',
    objectCreationType: 'expLevelClass',
    warn: expWarn,
    blockOnWarning: true,
  },
  PV: {
    routeBase: 'pv-level-classes',
    title: 'PV Level Classes',
    levelLabel: 'Point Value Limit',
    variant: 'int',
    objectCreationType: 'pvLevelClass',
    warn: pvWarn,
    blockOnWarning: true,
  },
  GRID: {
    routeBase: 'grid-level-classes',
    title: 'Grid Level Classes',
    levelLabel: 'Grid Size',
    variant: 'vector',
    objectCreationType: 'gridLevelClass',
  },
  DUNGEON_GRID: {
    routeBase: 'dungeon-grid-level-classes',
    title: 'Dungeon Grid Level Classes',
    levelLabel: 'Dungeon Grid Size',
    variant: 'vector',
    objectCreationType: 'dungeonGridLevelClass',
    maxUnits: true,
  },
  GENERATOR: {
    routeBase: 'generator-classes',
    title: 'Generator Classes',
    levelLabel: 'Generator',
    variant: 'generator',
    objectCreationType: 'generatorClass',
  },
};
