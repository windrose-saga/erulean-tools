import { UnitData } from "../../types/unit";
import { DataContext } from "./context";
import * as React from "react";

const DataContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [units, setUnits] = React.useState<UnitData[]>([]);
  return (
    <DataContext.Provider value={{ units, setUnits }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
