import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Unit } from "../types/unit";
import { Action } from "../types/action";
import { Augment } from "../types/augment";
import { createSelectors } from "../utils/createSelectors";

type State = {
  loaded: boolean;
  units: Record<string, Unit>;
  actions: Record<string, Action>;
  augments: Record<string, Augment>;
};

type Actions = {
  setLoaded: () => void;
  setUnits: (units: Record<string, Unit>) => void;
  setActions: (actions: Record<string, Action>) => void;
  setAugments: (augments: Record<string, Augment>) => void;
  setUnit: (unit: Unit) => void;
  setAction: (action: Action) => void;
  setAugment: (augment: Augment) => void;
};

const useGameStoreBase = create<State & Actions>()(
  immer((set) => ({
    loaded: false,
    units: {},
    actions: {},
    augments: {},
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
        state.units[unit.id] = unit;
      }),
    setAction: (action) =>
      set((state) => {
        state.actions[action.id] = action;
      }),
    setAugment: (augment) =>
      set((state) => {
        state.augments[augment.id] = augment;
      }),
  }))
);

export const useGameStore = createSelectors(useGameStoreBase);
