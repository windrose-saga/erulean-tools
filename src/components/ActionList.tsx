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

export const ActionList = () => {
  const actions = useActions();
  return <List items={actions} columns={actionColumns} defaultIndex="id" />;
};
