import * as React from "react";

import { useUnits } from "../store/getters/unit";
import { Unit } from "../types/unit";
import { Column } from "../types/list";
import { List } from "./List";
import { useNavigate } from "@tanstack/react-router";

const unitColumns: Column<Unit>[] = [
  { name: "Name", field: "name" },
  { name: "Max HP", field: "max_hp" },
  { name: "Max Mana", field: "max_mana" },
  { name: "Physical Defense", field: "phys_defense" },
  { name: "Special Defense", field: "spec_defense" },
  { name: "Speed", field: "speed" },
  { name: "Strength", field: "strength" },
  { name: "Intelligence", field: "intelligence" },
  { name: "Luck", field: "luck" },
  { name: "Bravery", field: "bravery" },
  { name: "Movement", field: "movement" },
  { name: "Can Flee", field: "can_flee" },
  { name: "Faithful", field: "faithful" },
  { name: "Movement Strategy", field: "movement_strategy" },
  { name: "Holding Distance", field: "holding_distance" },
  { name: "Is Commander", field: "is_commander" },
  { name: "Point Value", field: "point_value" },
];

export const UnitList = () => {
  const navigate = useNavigate();
  const units = useUnits();
  const onRowClick = React.useCallback(
    (unit: Unit) => {
      navigate({ to: "/units/$unitId", params: { unitId: unit.guid } });
    },
    [navigate]
  );
  return (
    <List
      items={units}
      columns={unitColumns}
      defaultIndex={"id"}
      onRowClick={onRowClick}
    />
  );
};
