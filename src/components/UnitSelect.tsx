import * as React from "react";
import { Unit } from "../types/unit";
import { useGameStore } from "../store/useGameStore";

type Props = {
  setUnit: (unit: Unit) => void;
};
const UnitSelect: React.FC<Props> = ({ setUnit }) => {
  const units = useGameStore.use.units();

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
