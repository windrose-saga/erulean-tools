import { Action } from './action';
import { Augment } from './augment';
import { DungeonPrefab } from './dungeonPrefab';
import { Item } from './item';
import { DungeonGridLevelClass, ExpLevelClass, GridLevelClass, PvLevelClass } from './levelClass';
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
  unitIds: string[];
  itemIds: string[];
  prefabIds: string[];
  expLevelClassIds: string[];
  pvLevelClassIds: string[];
  gridLevelClassIds: string[];
  dungeonGridLevelClassIds: string[];
  // Append-only, ordered vocabularies (index = Godot enum ordinal). `removed*Ids` are the
  // tombstoned subset (hidden in the UI, cascade-stripped from items/units, but kept in the
  // ordered list so existing ordinals never shift). Optional so legacy files predating these
  // fields still type-check; ingest seeds them from the SEED_* defaults when absent.
  lootCategoryIds?: string[];
  removedLootCategoryIds?: string[];
  generatorTagIds?: string[];
  removedGeneratorTagIds?: string[];
  trainable_units: string[];
  updatedAt: number;
};
