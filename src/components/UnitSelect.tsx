import * as React from "react";
import { UnitData } from "../types/unit";
import useDataContext from "../context/DataContext/useDataContext";

type Props = {
  setUnit: (unit: UnitData) => void;
};
const UnitSelect: React.FC<Props> = ({ setUnit }) => {
  const { units } = useDataContext();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = units.find((unit) => unit.id === e.target.value);
    if (selectedUnit) setUnit(selectedUnit);
  };
  return (
    <select onChange={handleChange}>
      {units.map((unit) => (
        <option key={unit.id} value={unit.id}>
          {unit.name}
        </option>
      ))}
    </select>
  );
};
export default UnitSelect;
