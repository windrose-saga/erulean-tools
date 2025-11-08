import { Actions, CommanderData, Unit } from '../types/unit';

export const DEFAULT_COMMANDER_DATA: CommanderData = {
  leadership: 0,
  point_limit: 0,
  grid_size_x: 1,
  grid_size_y: 1,
  global_augments: [],
  army_augments: [],
  enemy_army_augments: [],
  army_name: '',
};

export const DEFAULT_ACTIONS: Actions = {
  passive_action: null,
  primary_action: null,
  special_action: null,
  primary_action_mana_delta: 1,
  special_action_mana_delta: -5,
  passive_action_mana_delta: 0,
};

export const DEFAULT_UNIT: Unit = {
  guid: '',
  id: '',
  name: '',
  description: '',
  is_commander: false,
  commander_data: DEFAULT_COMMANDER_DATA,
  max_hp: 0,
  starting_hp: 0,
  max_mana: 0,
  starting_mana: 0,
  mana_growth: 0,
  phys_defense: 0,
  spec_defense: 0,
  speed: 0,
  strength: 0,
  intelligence: 0,
  luck: 0,
  bravery: 0,
  movement: 1,
  point_value: 0,
  can_flee: true,
  faithful: false,
  movement_strategy: 'ADVANCE',
  holding_distance: 0,
  inaction_limit: 20,
  actions: DEFAULT_ACTIONS,
  trainable: false,
  unit_cost: {},
  required_leadership: 0,
  gold_cost: 0,
};
