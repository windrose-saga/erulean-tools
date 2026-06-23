export const ROLES = [
  'NONE',
  'UTILITY',
  'FRONTLINE',
  'MIDLINE',
  'MAGECORE',
  'BACKLINE',
  'HEALER',
  'FLANKER',
] as const satisfies string[];
type Roles = typeof ROLES;
export type Role = Roles[number];

// Generator tags are a data-driven vocabulary authored in the tools and persisted in
// game-data.json (`generatorTagIds`/`removedGeneratorTagIds`). This constant is only the
// seed/default set for migrating legacy files. A GeneratorTag is just a string at the type level.
export const SEED_GENERATOR_TAGS = ['ERULEAN', 'MARCH'] as const satisfies string[];
export type GeneratorTag = string;

export type Unit = {
  guid: string;
  id: string;
  name: string;
  role: Role;
  generator_tags: Array<GeneratorTag>;
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
  exp_value: number;
  can_flee: boolean;
  faithful: boolean;
  movement_strategy: MovementStrategy;
  holding_distance: number;
  inaction_limit: number;
  is_commander: boolean;
  commander_data: CommanderData;
  actions: Actions;
  trainable: boolean;
  train_button_text: string;
  gold_cost: number;
  required_level: number;
  unit_cost: Record<string, number>;
  item_cost: Record<string, number>;
  item_slots: number;
  reward_for_defeat: Record<string, number>;
  returned_on_death: Record<string, number>;
  // Reward-generator weighting (mirrors Item.rarity): 0 = common, 1 = never drops.
  rarity: number;
  // Gate for the reward system: false excludes this unit from reward pools entirely.
  can_be_reward: boolean;
  // Army generator places at most one of this unit per generated army.
  unique: boolean;
};

export const MOVEMENT_STRATEGIES = ['ADVANCE', 'KEEP_DISTANCE'] as const satisfies string[];
type MovementStrategies = typeof MOVEMENT_STRATEGIES;
export type MovementStrategy = MovementStrategies[number];

export type CommanderData = {
  leadership: number;
  turn_movements: number;
  turn_actions: number;
  global_augments: Array<string>;
  army_augments: Array<string>;
  enemy_army_augments: Array<string>;
  army_name: string;
  // Each references a shareable level-class by its guid (defaults to the
  // well-known default-class guids). null only if a developer clears it.
  exp_level_class: string | null;
  pv_level_class: string | null;
  grid_level_class: string | null;
  dungeon_grid_level_class: string | null;
};

export type Actions = {
  primary_action: string | null;
  special_action: string | null;
  primary_action_mana_delta: number;
  special_action_mana_delta: number;
};
