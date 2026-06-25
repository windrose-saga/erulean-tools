import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';

import { List } from './List';

import { useUnits } from '../store/getters/unit';
import { useGameStore } from '../store/useGameStore';
import { Column } from '../types/list';
import { MOVEMENT_STRATEGIES, ROLES, Unit } from '../types/unit';

const unitColumns: Column<Unit>[] = [
  { name: 'Name', field: 'name', editable: true },
  { name: 'Max HP', field: 'max_hp', editable: true },
  { name: 'Max Mana', field: 'max_mana', editable: true },
  { name: 'Physical Defense', field: 'phys_defense', editable: true },
  { name: 'Special Defense', field: 'spec_defense', editable: true },
  { name: 'Speed', field: 'speed', editable: true },
  { name: 'Strength', field: 'strength', editable: true },
  { name: 'Intelligence', field: 'intelligence', editable: true },
  { name: 'Luck', field: 'luck', editable: true },
  { name: 'Bravery', field: 'bravery', editable: true },
  { name: 'Movement', field: 'movement', editable: true },
  { name: 'Can Flee', field: 'can_flee', editable: true },
  { name: 'Faithful', field: 'faithful', editable: true },
  {
    name: 'Movement Strategy',
    field: 'movement_strategy',
    editable: true,
    options: MOVEMENT_STRATEGIES,
  },
  { name: 'Holding Distance', field: 'holding_distance', editable: true },
  { name: 'Is Commander', field: 'is_commander', editable: true },
  { name: 'Trainable', field: 'trainable', editable: true },
  { name: 'Point Value', field: 'point_value', editable: true },
  { name: 'Rarity', field: 'rarity', editable: true },
  { name: 'Can Be Reward', field: 'can_be_reward', editable: true },
  { name: 'Can Horde', field: 'can_horde', editable: true },
  { name: 'Required Generator Level', field: 'required_generator_level', editable: true },
  { name: 'Role', field: 'role', editable: true, options: ROLES },
];

const searchFields: (keyof Unit)[] = ['name', 'id', 'description'];

export const UnitList = () => {
  const navigate = useNavigate();
  const units = useUnits();
  const setUnit = useGameStore.use.setUnit();
  const onRowClick = React.useCallback(
    (unit: Unit) => {
      navigate({ to: '/units/$unitId', params: { unitId: unit.guid } });
    },
    [navigate],
  );
  const onCellEdit = React.useCallback(
    <K extends keyof Unit>(unit: Unit, field: K, value: Unit[K]) => {
      setUnit({ ...unit, [field]: value });
    },
    [setUnit],
  );

  return (
    <List
      items={units}
      columns={unitColumns}
      defaultIndex="id"
      onRowClick={onRowClick}
      onCellEdit={onCellEdit}
      searchFields={searchFields}
      objectCreationType="unit"
    />
  );
};
