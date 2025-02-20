import { Action } from './action';
import { Augment } from './augment';
import { Unit } from './unit';

export type GameData = {
  units: Unit[];
  actions: Action[];
  augments: Augment[];
  unitIds: string[];
  updatedAt: number;
};
