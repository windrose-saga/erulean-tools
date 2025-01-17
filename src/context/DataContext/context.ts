import * as React from "react";
import { UnitData } from "../../types/unit";
import { ActionData } from "../../types/action";

export type DataContextValues = {
  units: UnitData[];
  setUnits: (units: UnitData[]) => void;
  actions: ActionData[];
  setActions: (actions: ActionData[]) => void;
};

export const DataContext = React.createContext<DataContextValues | undefined>(
  undefined
);
