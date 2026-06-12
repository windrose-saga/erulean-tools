import { Action } from './action';
import { Augment } from './augment';
import { DungeonPrefab } from './dungeonPrefab';
import { Item } from './item';
import { Unit } from './unit';

export type GameData = {
  units: Unit[];
  actions: Action[];
  augments: Augment[];
  items: Item[];
  prefabs: DungeonPrefab[];
  unitIds: string[];
  itemIds: string[];
  prefabIds: string[];
  trainable_units: string[];
  updatedAt: number;
};
