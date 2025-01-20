import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Unit } from "../types/unit";
import { Action } from "../types/action";
import { Augment } from "../types/augment";
import { createSelectors } from "../utils/createSelectors";

type State = {
  units: Array<Unit>;
  actions: Array<Action>;
  augments: Array<Augment>;
};

type Actions = {
  setUnits: (units: Array<Unit>) => void;
  setActions: (actions: Array<Action>) => void;
  setAugments: (augments: Array<Augment>) => void;
};

const useGameStoreBase = create<State & Actions>()(
  immer((set) => ({
    units: [],
    actions: [],
    augments: [],
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
  }))
);

export const useGameStore = createSelectors(useGameStoreBase);
