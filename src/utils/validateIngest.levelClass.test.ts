import { describe, expect, it } from 'vitest';

import { validateIngest } from './validateIngest';

import {
  DEFAULT_DUNGEON_GRID_LEVEL_CLASS,
  DEFAULT_EXP_LEVEL_CLASS,
  DEFAULT_GENERATOR_CLASS,
  DEFAULT_GRID_LEVEL_CLASS,
  DEFAULT_PV_LEVEL_CLASS,
} from '../constants/levelClass';
import { DEFAULT_COMMANDER_DATA, DEFAULT_UNIT } from '../constants/unit';
import { GeneratorClass, IntLevelClass, VectorLevelClass } from '../types/levelClass';
import { Unit } from '../types/unit';

const levelClasses = () => ({
  expLevelClasses: { [DEFAULT_EXP_LEVEL_CLASS.guid]: DEFAULT_EXP_LEVEL_CLASS },
  pvLevelClasses: { [DEFAULT_PV_LEVEL_CLASS.guid]: DEFAULT_PV_LEVEL_CLASS },
  gridLevelClasses: { [DEFAULT_GRID_LEVEL_CLASS.guid]: DEFAULT_GRID_LEVEL_CLASS },
  dungeonGridLevelClasses: {
    [DEFAULT_DUNGEON_GRID_LEVEL_CLASS.guid]: DEFAULT_DUNGEON_GRID_LEVEL_CLASS,
  },
  generatorClasses: { [DEFAULT_GENERATOR_CLASS.guid]: DEFAULT_GENERATOR_CLASS },
});

const commander = (overrides: Partial<Unit['commander_data']> = {}): Unit => ({
  ...DEFAULT_UNIT,
  guid: 'unit-guid',
  id: 'COMMANDER',
  is_commander: true,
  commander_data: {
    ...DEFAULT_COMMANDER_DATA,
    ...overrides,
  },
});

describe('level-class ingest validation', () => {
  it('rejects a commander reference that is missing from its matching table', () => {
    const errors = validateIngest(
      { unit: commander({ exp_level_class: 'missing-exp-guid' }) },
      {},
      {},
      {},
      levelClasses(),
    );

    expect(
      errors.some((error) =>
        error.message.includes("references missing EXP level class 'missing-exp-guid'"),
      ),
    ).toBe(true);
  });

  it('allows an explicitly cleared level-class reference', () => {
    const errors = validateIngest(
      { unit: commander({ exp_level_class: null }) },
      {},
      {},
      {},
      levelClasses(),
    );

    expect(errors).toEqual([]);
  });

  it('rejects a level-class id that starts with a digit', () => {
    const classes = levelClasses();
    classes.expLevelClasses['bad-guid'] = {
      guid: 'bad-guid',
      id: '2_FAST',
      name: 'Bad',
      levels: [0, 100],
    };

    const errors = validateIngest({}, {}, {}, {}, classes);

    expect(errors.some((error) => error.message.includes("id '2_FAST'"))).toBe(true);
  });

  it('rejects decreasing or duplicate EXP thresholds', () => {
    const classes: {
      expLevelClasses: Record<string, IntLevelClass>;
      pvLevelClasses: Record<string, IntLevelClass>;
      gridLevelClasses: Record<string, VectorLevelClass>;
      dungeonGridLevelClasses: Record<string, VectorLevelClass>;
      generatorClasses: Record<string, GeneratorClass>;
    } = levelClasses();
    classes.expLevelClasses[DEFAULT_EXP_LEVEL_CLASS.guid] = {
      ...DEFAULT_EXP_LEVEL_CLASS,
      levels: [0, 100, 100],
    };

    const errors = validateIngest({}, {}, {}, {}, classes);

    expect(errors.some((error) => error.message.includes('strictly increasing'))).toBe(true);
  });

  it('rejects non-positive PV values', () => {
    const classes = levelClasses();
    classes.pvLevelClasses[DEFAULT_PV_LEVEL_CLASS.guid] = {
      ...DEFAULT_PV_LEVEL_CLASS,
      levels: [100, 0],
    };

    const errors = validateIngest({}, {}, {}, {}, classes);

    expect(errors.some((error) => error.message.includes('only positive values'))).toBe(true);
  });

  it('rejects non-positive regular and dungeon grid dimensions', () => {
    const classes = levelClasses();
    classes.gridLevelClasses[DEFAULT_GRID_LEVEL_CLASS.guid] = {
      ...DEFAULT_GRID_LEVEL_CLASS,
      levels: [{ x: 0, y: 10 }],
    };
    classes.dungeonGridLevelClasses[DEFAULT_DUNGEON_GRID_LEVEL_CLASS.guid] = {
      ...DEFAULT_DUNGEON_GRID_LEVEL_CLASS,
      levels: [{ x: 2, y: -1 }],
    };

    const errors = validateIngest({}, {}, {}, {}, classes);

    expect(errors.some((error) => error.message.includes('Grid level class'))).toBe(true);
    expect(errors.some((error) => error.message.includes('Dungeon Grid level class'))).toBe(true);
  });
});
