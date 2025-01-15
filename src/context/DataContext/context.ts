import * as React from "react";
import { UnitData } from "../../types/unit";

export type DataContextValues = {
  units: UnitData[];
  setUnits: (units: UnitData[]) => void;
};

export const DataContext = React.createContext<DataContextValues | undefined>(
  undefined
);
