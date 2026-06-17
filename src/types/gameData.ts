import { Action } from './action';
import { Augment } from './augment';
import { DungeonPrefab } from './dungeonPrefab';
import { Item } from './item';
import {
  DungeonGridLevelClass,
  ExpLevelClass,
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
  unitIds: string[];
  itemIds: string[];
  prefabIds: string[];
  expLevelClassIds: string[];
  pvLevelClassIds: string[];
  gridLevelClassIds: string[];
  dungeonGridLevelClassIds: string[];
  trainable_units: string[];
  updatedAt: number;
};
