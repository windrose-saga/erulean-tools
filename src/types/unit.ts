export type Unit = {
  guid: string;
  id: string;
  name: string;
  description: string;
  max_hp: number;
  starting_hp: number;
  max_mana: number;
  starting_mana: number;
  mana_growth: number;
  phys_defense: number;
  spec_defense: number;
  speed: number;
  strength: number;
  intelligence: number;
  luck: number;
  bravery: number;
  movement: number;
  point_value: number;
  can_flee: boolean;
  faithful: boolean;
  movement_strategy: MovementStrategy;
  holding_distance: number;
  inaction_limit: number;
  is_commander: boolean;
  commander_data: CommanderData;
  actions: Actions;
};

export const MOVEMENT_STRATEGIES = ['ADVANCE', 'KEEP_DISTANCE'] as const satisfies string[];
type MovementStrategies = typeof MOVEMENT_STRATEGIES;
export type MovementStrategy = MovementStrategies[number];

export type CommanderData = {
  leadership: number;
  point_limit: number;
  grid_size_x: number;
  grid_size_y: number;
  global_augments: Array<string>;
  army_augments: Array<string>;
  enemy_army_augments: Array<string>;
  army_name: string;
};

export type Actions = {
  passive_action: string | null;
  primary_action: string | null;
  special_action: string | null;
  primary_action_mana_delta: number;
  special_action_mana_delta: number;
  passive_action_mana_delta: number;
};
