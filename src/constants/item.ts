import { DEFAULT_SHARED_AUGMENT_DATA } from './augment';

import { ConsumableEffect, ConsumableProps, EquipmentProps, Item } from '../types/item';

export const DEFAULT_EQUIPMENT_PROPS: EquipmentProps = {
  effects: [],
  everlasting: false,
  slot: 0,
  quality: 0,
  for_role: [],
  shared_augment_data: DEFAULT_SHARED_AUGMENT_DATA,
  augment_effects: [],
};

// Defaults mirror the Godot @export defaults for each effect class. save_key is filled with
// a UUID when an effect is added (form) or ingested with an empty key (useIngest), never here.
export const DEFAULT_CONSUMABLE_EFFECT: ConsumableEffect = {
  effect_class: 'GRANT_MOVEMENT',
  duration: 1,
  save_key: '',
  grant_movement_props: { moves: 1 },
  grant_action_props: { actions: 1 },
  reduce_army_aggro_props: { reduction: 1 },
  restore_party_health_props: { mode: 'FULL', amount: 0 },
  expand_vision_props: { bonus_radius: 2 },
  reduce_enemy_vision_props: { reduction: 2 },
  spawn_enemies_props: { count: 3 },
  next_battle_augments_props: {
    player_army_augments: [],
    enemy_army_augments: [],
    global_augments: [],
  },
  boost_drop_rate_props: { multiplier: 1.5, rarity_pressure_multiplier: 1.0 },
  boost_exp_rate_props: { multiplier: 1.5 },
  reduce_mortality_props: { multiplier: 0.5 },
};

export const DEFAULT_CONSUMABLE_PROPS: ConsumableProps = {
  effects: [],
  consumed_on_use: true,
};

export const DEFAULT_ITEM_DATA: Item = {
  guid: '',
  id: '',
  name: '',
  description: '',
  item_type: 'ITEM',
  gold_value: 0,
  sellable: true,
  rarity: 0,
  loot_categories: [],
  equipment_props: DEFAULT_EQUIPMENT_PROPS,
  consumable_props: DEFAULT_CONSUMABLE_PROPS,
};
