import { ActionData } from "../../types/action";
import { UnitData } from "../../types/unit";
import { DataContext } from "./context";
import * as React from "react";

const DataContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [units, setUnits] = React.useState<UnitData[]>([]);
  const [actions, setActions] = React.useState<ActionData[]>([]);
  return (
    <DataContext.Provider value={{ units, setUnits, actions, setActions }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
