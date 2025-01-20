import * as React from "react";
import { Unit } from "../../types/unit";
import { Action } from "../../types/action";
import { Augment } from "../../types/augment";

export type DataContextValues = {
  units: Unit[];
  setUnits: (units: Unit[]) => void;
  actions: Action[];
  setActions: (actions: Action[]) => void;
  augments: Augment[];
  setAugments: (augments: Augment[]) => void;
};

export const DataContext = React.createContext<DataContextValues | undefined>(
  undefined
);
