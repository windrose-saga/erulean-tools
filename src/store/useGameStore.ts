import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Unit } from '../types/unit';
import { createSelectors } from '../utils/createSelectors';

type State = {
  loaded: boolean;
  units: Record<string, Unit>;
  actions: Record<string, Action>;
  augments: Record<string, Augment>;
};

type Actions = {
  reset: () => void;
  setLoaded: () => void;
  setUnits: (units: Record<string, Unit>) => void;
  setActions: (actions: Record<string, Action>) => void;
  setAugments: (augments: Record<string, Augment>) => void;
  setUnit: (unit: Unit) => void;
  setAction: (action: Action) => void;
  setAugment: (augment: Augment) => void;
};

const initialState: State = {
  loaded: false,
  units: {},
  actions: {},
  augments: {},
};

const useGameStoreBase = create<State & Actions>()(
  immer((set) => ({
    ...initialState,
    reset: () => {
      set(initialState);
    },
    setLoaded: () =>
      set((state) => {
        state.loaded = true;
      }),
    setUnits: (units) =>
      set((state) => {
        state.units = units;
      }),
    setActions: (actions) =>
      set((state) => {
        state.actions = actions;
      }),
    setAugments: (augments) =>
      set((state) => {
        state.augments = augments;
      }),
    setUnit: (unit) =>
      set((state) => {
        state.units[unit.guid] = unit;
      }),
    setAction: (action) =>
      set((state) => {
        state.actions[action.guid] = action;
      }),
    setAugment: (augment) =>
      set((state) => {
        state.augments[augment.guid] = augment;
      }),
  })),
);

export const useGameStore = createSelectors(useGameStoreBase);
