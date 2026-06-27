import { Action } from './action';
import { Augment } from './augment';
import { DungeonPrefab } from './dungeonPrefab';
import { Item } from './item';
import {
  DungeonGridLevelClass,
  ExpLevelClass,
  GeneratorClass,
  GridLevelClass,
  PvLevelClass,
} from './levelClass';
import { Unit } from './unit';

export type GameData = {
  units: Unit[];
  actions: Action[];
  augments: Augment[];
  items: Item[];
  prefabs: DungeonPrefab[];
  expLevelClasses: ExpLevelClass[];
  pvLevelClasses: PvLevelClass[];
  gridLevelClasses: GridLevelClass[];
  dungeonGridLevelClasses: DungeonGridLevelClass[];
  generatorClasses: GeneratorClass[];
  unitIds: string[];
  itemIds: string[];
  prefabIds: string[];
  expLevelClassIds: string[];
  pvLevelClassIds: string[];
  gridLevelClassIds: string[];
  dungeonGridLevelClassIds: string[];
  generatorClassIds: string[];
  // Append-only, ordered vocabularies (index = Godot enum ordinal). `removed*Ids` are the
  // tombstoned subset (hidden in the UI, cascade-stripped from items/units, but kept in the
  // ordered list so existing ordinals never shift). Optional so legacy files predating these
  // fields still type-check; ingest seeds them from the SEED_* defaults when absent.
  lootCategoryIds?: string[];
  removedLootCategoryIds?: string[];
  generatorTagIds?: string[];
  removedGeneratorTagIds?: string[];
  // Durable name -> ordinal ledgers: every name a vocabulary has ever held (including names
  // retired by rename) mapped to its permanent ordinal, so a name can never be rebound to a
  // different integer. Optional/legacy-safe — ingest reconstructs them from positions when absent.
  lootCategoryOrdinals?: Record<string, number>;
  generatorTagOrdinals?: Record<string, number>;
  trainable_units: string[];
  updatedAt: number;
};
