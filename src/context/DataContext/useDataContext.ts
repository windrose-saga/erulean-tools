import { useContext } from "react";
import { DataContext } from "./context";

const useDataContext = () => {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }

  return context;
};

export default useDataContext;
