import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useActions } from '../store/getters/action';
import { Action } from '../types/action';
import { Column } from '../types/list';

const actionColumns: Column<Action>[] = [
  { name: 'Name', field: 'name' },
  { name: 'Type', field: 'action_type' },
  { name: 'Mana Delta', field: 'mana_delta' },
  { name: 'Break Vanguard', field: 'break_vanguard' },
  { name: 'Approach Strategy', field: 'approach_strategy' },
  { name: 'Splash', field: 'splash' },
  { name: 'Chain', field: 'chain' },
  { name: 'Targeting Type', field: 'targeting_type' },
  { name: 'Target Self', field: 'target_self' },
  { name: 'Targeting Range', field: 'targeting_range' },
  { name: 'Max Targets', field: 'max_targets' },
  { name: 'Should Check Evasion', field: 'should_check_evasion' },
  { name: 'Evasion Multiplier', field: 'evasion_multiplier' },
  { name: 'Can Crit', field: 'can_crit' },
  { name: 'Crit Chance Multiplier', field: 'crit_chance_multiplier' },
];

const searchFields: (keyof Action)[] = ['name', 'id', 'description', 'action_type'];

export const ActionList = () => {
  const navigate = useNavigate();
  const actions = useActions();
  const onRowClick = React.useCallback(
    (action: Action) => {
      navigate({ to: '/actions/$actionId', params: { actionId: action.guid } });
    },
    [navigate],
  );
  return (
    <List
      items={actions}
      columns={actionColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      objectCreationType="action"
    />
  );
};
