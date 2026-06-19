import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useActions } from '../store/getters/action';
import { useGameStore } from '../store/useGameStore';
import { ACTION_TYPES, APPROACH_STRATEGIES, Action } from '../types/action';
import { Column } from '../types/list';

const actionColumns: Column<Action>[] = [
  { name: 'Name', field: 'name', editable: true },
  { name: 'Type', field: 'action_type', editable: true, options: ACTION_TYPES },
  { name: 'Break Vanguard', field: 'break_vanguard', editable: true },
  {
    name: 'Approach Strategy',
    field: 'approach_strategy',
    editable: true,
    options: APPROACH_STRATEGIES,
  },
  { name: 'Splash', field: 'splash', editable: true },
  { name: 'Chain', field: 'chain', editable: true },
  { name: 'Target Self', field: 'target_self', editable: true },
  { name: 'Targeting Range', field: 'targeting_range', editable: true },
  { name: 'Max Targets', field: 'max_targets', editable: true },
  { name: 'Should Check Evasion', field: 'should_check_evasion', editable: true },
  { name: 'Evasion Multiplier', field: 'evasion_multiplier', editable: true },
  { name: 'Can Crit', field: 'can_crit', editable: true },
  { name: 'Crit Chance Multiplier', field: 'crit_chance_multiplier', editable: true },
];

const searchFields: (keyof Action)[] = ['name', 'id', 'description', 'action_type'];

export const ActionList = () => {
  const navigate = useNavigate();
  const actions = useActions();
  const setAction = useGameStore.use.setAction();
  const onRowClick = React.useCallback(
    (action: Action) => {
      navigate({ to: '/actions/$actionId', params: { actionId: action.guid } });
    },
    [navigate],
  );
  const onCellEdit = React.useCallback(
    <K extends keyof Action>(action: Action, field: K, value: Action[K]) => {
      setAction({ ...action, [field]: value });
    },
    [setAction],
  );
  return (
    <List
      items={actions}
      columns={actionColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      onCellEdit={onCellEdit}
      objectCreationType="action"
    />
  );
};
