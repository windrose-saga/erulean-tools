import { Action } from './action';
import { Augment } from './augment';
import { Item } from './item';
import { Unit } from './unit';

export type GameData = {
  units: Unit[];
  actions: Action[];
  augments: Augment[];
  items: Item[];
  unitIds: string[];
  itemIds: string[];
  trainable_units: string[];
  updatedAt: number;
};
