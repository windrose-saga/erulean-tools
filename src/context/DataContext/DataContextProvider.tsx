import { Action } from "../../types/action";
import { Augment } from "../../types/augment";
import { Unit } from "../../types/unit";
import { DataContext } from "./context";
import * as React from "react";

const DataContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [actions, setActions] = React.useState<Action[]>([]);
  const [augments, setAugments] = React.useState<Augment[]>([]);

  return (
    <DataContext.Provider
      value={{ units, setUnits, actions, setActions, augments, setAugments }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
