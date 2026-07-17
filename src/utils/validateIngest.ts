import { isValidVocabId } from './vocabId';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { DungeonPrefab } from '../types/dungeonPrefab';
import { Item } from '../types/item';
import { GeneratorClass, IntLevelClass, VectorLevelClass } from '../types/levelClass';
import { Unit } from '../types/unit';

type ErrorType = 'unit' | 'action' | 'augment' | 'prefab' | 'levelClass' | 'item';
type Error = {
  type: ErrorType;
  message: string;
};

type LevelClassRecords = {
  expLevelClasses: Record<string, IntLevelClass>;
  pvLevelClasses: Record<string, IntLevelClass>;
  gridLevelClasses: Record<string, VectorLevelClass>;
  dungeonGridLevelClasses: Record<string, VectorLevelClass>;
  generatorClasses: Record<string, GeneratorClass>;
};

type VocabularyInput = {
  items: Record<string, Item>;
  lootCategoryIds: string[];
  removedLootCategoryIds: string[];
  generatorTagIds: string[];
  removedGeneratorTagIds: string[];
  lootCategoryOrdinals?: Record<string, number>;
  generatorTagOrdinals?: Record<string, number>;
};

export const validateIngest = (
  units: Record<string, Unit>,
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
  prefabs: Record<string, DungeonPrefab> = {},
  levelClasses?: LevelClassRecords,
  vocabularies?: VocabularyInput,
) => {
  const unitErrors = validateUnits(units, actions, augments, levelClasses);
  const actionErrors = validateActions(actions, augments, units);
  const augmentErrors = validateAugments(augments, actions);
  const prefabErrors = validatePrefabs(prefabs);
  const levelClassErrors = levelClasses ? validateLevelClasses(levelClasses) : [];
  const vocabularyErrors = vocabularies ? validateVocabularies(units, vocabularies) : [];
  const itemErrors = vocabularies ? validateItems(vocabularies.items, actions) : [];
  return [
    ...unitErrors,
    ...actionErrors,
    ...augmentErrors,
    ...prefabErrors,
    ...levelClassErrors,
    ...vocabularyErrors,
    ...itemErrors,
  ];
};

// An ACTION_SWAP augment/effect points its `action` at an existing Action guid. A dangling
// guid would crash Godot's IngestData._load_action_from_guid on `filtered_lines.front()`,
// so reject it here. '' means "(None)" and is allowed.
const actionSwapRefError = (
  owner: string,
  augmentClass: string,
  actionGuid: string,
  actions: Record<string, Action>,
  type: ErrorType,
): Error | null => {
  if (augmentClass === 'ACTION_SWAP' && actionGuid && !(actionGuid in actions)) {
    return {
      type,
      message: `${owner} ACTION_SWAP references action that does not exist: ${actionGuid}`,
    };
  }
  return null;
};

const validateAugments = (augments: Record<string, Augment>, actions: Record<string, Action>) => {
  const errors: Error[] = [];
  Object.values(augments).forEach((augment) => {
    const error = actionSwapRefError(
      `Augment ${augment.id}`,
      augment.augment_class,
      augment.action_swap_props.action,
      actions,
      'augment',
    );
    if (error) {
      errors.push(error);
    }
  });
  return errors;
};

const validateItems = (items: Record<string, Item>, actions: Record<string, Action>) => {
  const errors: Error[] = [];
  Object.values(items).forEach((item) => {
    (item.equipment_props?.augment_effects ?? []).forEach((effect) => {
      const error = actionSwapRefError(
        `Item ${item.id} inline effect`,
        effect.augment_class,
        effect.action_swap_props?.action ?? '',
        actions,
        'item',
      );
      if (error) {
        errors.push(error);
      }
    });
  });
  return errors;
};

// Loot-category / generator-tag vocabularies feed Godot enum codegen (Item/UnitConstants.gd) and
// their ordinals back persisted resources, so these are hard errors: invalid identifiers,
// duplicates, a tombstone list that is not a clean subset, or any item/unit referencing an
// unknown OR tombstoned value.
const validateVocabularies = (units: Record<string, Unit>, vocab: VocabularyInput) => {
  const errors: Error[] = [];

  const checkList = (
    type: ErrorType,
    label: string,
    full: string[],
    removed: string[],
    references: Array<{ owner: string; values: string[] }>,
    ordinals?: Record<string, number>,
  ) => {
    full.forEach((name) => {
      if (!isValidVocabId(name)) {
        errors.push({
          type,
          message: `${label} '${name}' must be UPPER_CASE letters/digits/underscores starting with a letter or underscore`,
        });
      }
    });
    const uniqueFull = new Set(full);
    if (full.length !== uniqueFull.size) {
      const duplicates = full.filter((name, index) => full.indexOf(name) !== index);
      errors.push({ type, message: `Duplicate ${label} values found: ${duplicates.join(', ')}` });
    }
    const uniqueRemoved = new Set(removed);
    if (removed.length !== uniqueRemoved.size) {
      const duplicates = removed.filter((name, index) => removed.indexOf(name) !== index);
      errors.push({
        type,
        message: `Duplicate removed ${label} values found: ${duplicates.join(', ')}`,
      });
    }
    removed.forEach((name) => {
      if (!uniqueFull.has(name)) {
        errors.push({
          type,
          message: `Removed ${label} '${name}' is not present in the full list`,
        });
      }
    });

    // Ordinal-ledger guard (when the file carries one): every current name must be bound to the
    // index it actually occupies. A mismatch means a hand-edit moved a name across ordinals, which
    // would remap persisted Godot enum integers in windrose-saga — a hard error, not a silent fix.
    if (ordinals) {
      full.forEach((name, index) => {
        const bound = ordinals[name];
        if (bound !== undefined && bound !== index) {
          errors.push({
            type,
            message: `${label} '${name}' is at index ${index} but the ordinal ledger binds it to ${bound}; reordering/renaming would remap persisted ordinals`,
          });
        }
      });
    }

    const activeSet = new Set(full.filter((name) => !uniqueRemoved.has(name)));
    references.forEach(({ owner, values }) => {
      values.forEach((value) => {
        if (!uniqueFull.has(value)) {
          errors.push({ type, message: `${owner} references unknown ${label} '${value}'` });
        } else if (!activeSet.has(value)) {
          errors.push({ type, message: `${owner} references removed ${label} '${value}'` });
        }
      });
    });
  };

  checkList(
    'item',
    'loot category',
    vocab.lootCategoryIds,
    vocab.removedLootCategoryIds,
    Object.values(vocab.items).map((item) => ({
      owner: `Item ${item.id}`,
      values: item.loot_categories,
    })),
    vocab.lootCategoryOrdinals,
  );
  checkList(
    'unit',
    'generator tag',
    vocab.generatorTagIds,
    vocab.removedGeneratorTagIds,
    Object.values(units).map((unit) => ({
      owner: `Unit ${unit.id}`,
      values: unit.generator_tags,
    })),
    vocab.generatorTagOrdinals,
  );

  return errors;
};

// Level-class ids feed Godot enum codegen (LevelClassConstants.gd), so invalid
// or duplicate ids are hard errors per table, matching the unit/prefab pattern.
const validateLevelClasses = (levelClasses: LevelClassRecords) => {
  const errors: Error[] = [];
  const tables: Array<[string, Record<string, { id: string }>]> = [
    ['EXP', levelClasses.expLevelClasses],
    ['PV', levelClasses.pvLevelClasses],
    ['Grid', levelClasses.gridLevelClasses],
    ['Dungeon Grid', levelClasses.dungeonGridLevelClasses],
    ['Generator', levelClasses.generatorClasses],
  ];

  tables.forEach(([label, table]) => {
    const ids = Object.values(table).map((levelClass) => levelClass.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      errors.push({
        type: 'levelClass',
        message: `Duplicate ${label} level-class ids found: ${duplicateIds.join(', ')}`,
      });
    }
    ids.forEach((id) => {
      if (!isValidVocabId(id)) {
        errors.push({
          type: 'levelClass',
          message: `${label} level-class id '${id}' must be an upper-case identifier that does not start with a digit`,
        });
      }
    });
  });

  Object.values(levelClasses.expLevelClasses).forEach((levelClass) => {
    const hasNegativeValue = levelClass.levels.some((value) => value < 0);
    const isStrictlyIncreasing = levelClass.levels.every(
      (value, index) => index === 0 || value > levelClass.levels[index - 1],
    );
    if (hasNegativeValue || !isStrictlyIncreasing) {
      errors.push({
        type: 'levelClass',
        message: `EXP level class ${levelClass.id} must contain non-negative, strictly increasing values`,
      });
    }
  });

  Object.values(levelClasses.pvLevelClasses).forEach((levelClass) => {
    if (levelClass.levels.some((value) => value <= 0)) {
      errors.push({
        type: 'levelClass',
        message: `PV level class ${levelClass.id} must contain only positive values`,
      });
    }
  });

  const vectorTables: Array<[string, Record<string, VectorLevelClass>]> = [
    ['Grid', levelClasses.gridLevelClasses],
    ['Dungeon Grid', levelClasses.dungeonGridLevelClasses],
  ];
  vectorTables.forEach(([label, table]) => {
    Object.values(table).forEach((levelClass) => {
      if (levelClass.levels.some((value) => value.x <= 0 || value.y <= 0)) {
        errors.push({
          type: 'levelClass',
          message: `${label} level class ${levelClass.id} must contain only positive dimensions`,
        });
      }
    });
  });

  // Dungeon Grid classes carry a second per-level curve, `max_units` (the dungeon party-size
  // cap). Godot clamps a short curve rather than erroring, so this is the only place a
  // misaligned or invalid cap gets caught — a 0 would leave no unit placeable at all, and
  // non-finite values stringify to null on export.
  Object.values(levelClasses.dungeonGridLevelClasses).forEach((levelClass) => {
    const maxUnits = levelClass.max_units ?? [];
    if (maxUnits.some((value) => !Number.isInteger(value) || value <= 0)) {
      errors.push({
        type: 'levelClass',
        message: `Dungeon Grid level class ${levelClass.id} must contain only positive integer max unit counts`,
      });
    }
    if (maxUnits.length !== levelClass.levels.length) {
      errors.push({
        type: 'levelClass',
        message: `Dungeon Grid level class ${levelClass.id} must have one max unit count per level`,
      });
    }
  });

  Object.values(levelClasses.generatorClasses).forEach((generatorClass) => {
    if (generatorClass.jitter.some((value) => value < 0 || value > 100)) {
      errors.push({
        type: 'levelClass',
        message: `Generator class ${generatorClass.id} jitter values must be in [0, 100]`,
      });
    }
    if (generatorClass.rarity_pressure.some((value) => value < 0)) {
      errors.push({
        type: 'levelClass',
        message: `Generator class ${generatorClass.id} rarity_pressure values must be non-negative`,
      });
    }
  });

  return errors;
};

const validatePrefabs = (prefabs: Record<string, DungeonPrefab>) => {
  const errors: Error[] = [];
  const ids = Object.values(prefabs).map((prefab) => prefab.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push({
      type: 'prefab',
      message: `Duplicate prefab ids found: ${duplicateIds.join(', ')}`,
    });
  }

  Object.values(prefabs).forEach((prefab) => {
    if (!/^[A-Z0-9]+$/.test(prefab.id)) {
      errors.push({
        type: 'prefab',
        message: `Prefab id '${prefab.id}' must be all caps letters/numbers with no spaces or symbols`,
      });
    }
    if (!/[.*]/.test(prefab.layout)) {
      errors.push({
        type: 'prefab',
        message: `Prefab ${prefab.id} has no floor cells (needs at least one '.' or '*')`,
      });
    }
    if (!prefab.layout.includes('*')) {
      errors.push({
        type: 'prefab',
        message: `Prefab ${prefab.id} has no entrance (needs at least one '*' connector)`,
      });
    }
  });

  return errors;
};

const validateUnits = (
  units: Record<string, Unit>,
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
  levelClasses?: LevelClassRecords,
) => {
  const errors: Error[] = [];
  const ids = Object.values(units).map((unit) => unit.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push({
      type: 'unit',
      message: `Duplicate unit ids found: ${duplicateIds.join(', ')}`,
    });
  }

  Object.values(units).forEach((unit) => {
    if (unit.is_commander) {
      if (!unit.commander_data) {
        errors.push({
          type: 'unit',
          message: `Unit ${unit.id} is a commander but is missing commander data`,
        });
      } else {
        const { global_augments, army_augments, enemy_army_augments } = unit.commander_data;
        const invalidAugments = global_augments
          .concat(army_augments)
          .concat(enemy_army_augments)
          .filter((augmentId) => !(augmentId in augments));
        if (invalidAugments.length > 0) {
          errors.push({
            type: 'unit',
            message: `Unit ${unit.id} references invalid augments: ${invalidAugments.join(', ')}`,
          });
        }

        if (levelClasses) {
          const references: Array<
            [string, string | null, Record<string, IntLevelClass | VectorLevelClass>]
          > = [
            ['EXP', unit.commander_data.exp_level_class, levelClasses.expLevelClasses],
            ['PV', unit.commander_data.pv_level_class, levelClasses.pvLevelClasses],
            ['Grid', unit.commander_data.grid_level_class, levelClasses.gridLevelClasses],
            [
              'Dungeon Grid',
              unit.commander_data.dungeon_grid_level_class,
              levelClasses.dungeonGridLevelClasses,
            ],
          ];
          references.forEach(([label, guid, table]) => {
            if (guid !== null && !(guid in table)) {
              errors.push({
                type: 'unit',
                message: `Unit ${unit.id} references missing ${label} level class '${guid}'`,
              });
            }
          });
        }
      }
    }

    // if (!Number.isFinite(unit.rarity) || unit.rarity < 0 || unit.rarity > 1) {
    //   errors.push({
    //     type: 'unit',
    //     message: `Unit ${unit.id} has invalid reward rarity '${unit.rarity}' (must be a number in [0, 1])`,
    //   });
    // }

    if (typeof unit.can_be_reward !== 'boolean') {
      errors.push({
        type: 'unit',
        message: `Unit ${unit.id} has invalid can_be_reward '${String(unit.can_be_reward)}' (must be a boolean)`,
      });
    }

    // Accept real numbers and non-empty numeric strings (game-data.json persists numbers as
    // strings); reject blanks, null, booleans, negatives, and fractionals. Value-based, so
    // '1.0' is accepted as the integer 1. Typed unknown because authored JSON may carry a
    // string even though the model declares a number.
    const rawGeneratorLevel: unknown = unit.required_generator_level;
    let generatorLevel = Number.NaN;
    if (typeof rawGeneratorLevel === 'number') {
      generatorLevel = rawGeneratorLevel;
    } else if (typeof rawGeneratorLevel === 'string' && rawGeneratorLevel.trim() !== '') {
      generatorLevel = Number(rawGeneratorLevel);
    }
    if (!Number.isInteger(generatorLevel) || generatorLevel < 0) {
      errors.push({
        type: 'unit',
        message: `Unit ${unit.id} has invalid required_generator_level '${String(
          rawGeneratorLevel,
        )}' (must be a non-negative integer)`,
      });
    }

    Object.values(unit.actions).forEach((action) => {
      if (!Number.isNaN(action)) {
        return;
      }
      if (action !== null && !(action in actions)) {
        errors.push({
          type: 'unit',
          message: `Unit ${unit.id} references action that does not exist: ${action}`,
        });
      }
    });
  });

  return errors;
};

const validateActions = (
  actions: Record<string, Action>,
  augments: Record<string, Augment>,
  units: Record<string, Unit>,
) => {
  const errors: Error[] = [];
  const ids = Object.values(actions).map((action) => action.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push({
      type: 'action',
      message: `Duplicate action ids found: ${duplicateIds.join(', ')}`,
    });
  }

  Object.values(actions).forEach((action) => {
    if (action.action_type === 'AUGMENT_ACTION') {
      const invalidAugments = action.augment_action_props.augments
        .concat(action.augment_action_props.crit_augments)
        .filter((augmentId) => !(augmentId in augments));

      if (invalidAugments.length > 0) {
        errors.push({
          type: 'action',
          message: `Augment action ${
            action.id
          } references invalid augments: ${invalidAugments.join(', ')}`,
        });
      }
    }

    if (action.action_type === 'SUMMON_ACTION') {
      if (
        action.summon_action_props.summon_augment !== null &&
        !(action.summon_action_props.summon_augment in augments)
      ) {
        errors.push({
          type: 'action',
          message: `Summon action ${action.id} references invalid summon augment: ${action.summon_action_props.summon_augment}`,
        });
      }
      const invalidSummonIds = action.summon_action_props.summons.filter((id) => !(id in units));
      if (invalidSummonIds.length > 0) {
        errors.push({
          type: 'action',
          message: `Action ${
            action.id
          } references invalid summon ids: ${invalidSummonIds.join(', ')}`,
        });
      }
    }

    if (action.action_type === 'DAMAGE_ACTION') {
      const invalidAugments = action.damage_action_props.augments
        .concat(action.damage_action_props.crit_augments)
        .filter((augmentId) => !(augmentId in augments));

      if (invalidAugments.length > 0) {
        errors.push({
          type: 'action',
          message: `Damage action ${
            action.id
          } references invalid augments: ${invalidAugments.join(', ')}`,
        });
      }
    }

    const inlineEffects = [
      ...(action.damage_action_props?.augment_effects ?? []),
      ...(action.damage_action_props?.crit_augment_effects ?? []),
      ...(action.augment_action_props?.augment_effects ?? []),
      ...(action.augment_action_props?.crit_augment_effects ?? []),
    ];
    inlineEffects.forEach((effect) => {
      const error = actionSwapRefError(
        `Action ${action.id} inline effect`,
        effect.augment_class,
        effect.action_swap_props?.action ?? '',
        actions,
        'action',
      );
      if (error) {
        errors.push(error);
      }
    });

    if (action.action_type === 'MANA_ACTION' && action.mana_action_props.tag_augment !== null) {
      if (!(action.mana_action_props.tag_augment in augments)) {
        errors.push({
          type: 'action',
          message: `Mana action ${action.id} references invalid tag augment: ${action.mana_action_props.tag_augment}`,
        });
      }
    }

    if (action.action_type === 'TAG_ACTION' && action.tag_action_props.tag_augment !== null) {
      if (!(action.tag_action_props.tag_augment in augments)) {
        errors.push({
          type: 'action',
          message: `Tag action ${action.id} references invalid tag augment: ${action.tag_action_props.tag_augment}`,
        });
      }
    }
  });

  return errors;
};
