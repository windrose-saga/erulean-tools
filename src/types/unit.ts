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

export type MovementStrategy = 'ADVANCE' | 'KEEP_DISTANCE';

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
};
