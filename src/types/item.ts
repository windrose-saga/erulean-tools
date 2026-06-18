import { AugmentEffect, SharedAugmentData } from './augment';
import { Role } from './unit';

export const ITEM_TYPES = ['ITEM', 'EQUIPMENT', 'CONSUMABLE'] as const satisfies string[];
type ItemTypes = typeof ITEM_TYPES;
export type ItemType = ItemTypes[number];

// Loot categories are now a data-driven vocabulary authored in the tools and persisted in
// game-data.json (see `lootCategoryIds`/`removedLootCategoryIds` on GameData). This constant is
// only the seed/default set used to migrate legacy files that predate those fields. A
// LootCategory is therefore just a string at the type level.
export const SEED_LOOT_CATEGORIES = [
  'WEAPON',
  'ARMOR',
  'MATERIAL',
  'MEADOWMERE',
  'WOODMERE',
  'CONSUMABLE',
] as const satisfies string[];
export type LootCategory = string;

export type Item = {
  guid: string;
  id: string;
  name: string;
  description: string;
  item_type: ItemType;
  gold_value: number;
  sellable: boolean;
  rarity: number;
  loot_categories: Array<LootCategory>;
  equipment_props: EquipmentProps;
  consumable_props: ConsumableProps;
};

export type EquipmentProps = {
  effects: Array<string>;
  everlasting: boolean;
  slot: number;
  quality: number;
  for_role: Array<Role>;
  shared_augment_data: SharedAugmentData;
  augment_effects: Array<AugmentEffect>;
};

// CONSUMABLE: mirrors the Godot `Consumable` (extends Item) -> Array[ConsumableEffect]
// composition. Source of truth for the effect classes/props/defaults is
// windrose-saga/source/scenes/inventory/ (Consumable.gd, ConsumableEffect.gd,
// DurationalConsumableEffect.gd, and effects/*.gd).
export const CONSUMABLE_EFFECT_CLASSES = [
  'GRANT_MOVEMENT',
  'GRANT_ACTION',
  'WARP_TO_RESPAWN',
  'REDUCE_ARMY_AGGRO',
  'RESTORE_PARTY_HEALTH',
  'REVEAL_FLOOR',
  'EXPAND_VISION',
  'MARK_CHESTS',
  'MARK_ENEMIES',
  'FREEZE_ENEMIES',
  'DISABLE_ENEMY_AGGRO',
  'REDUCE_ENEMY_VISION',
  'ESCAPE_ROPE',
  'UNLOCK_DOORS',
  'SPAWN_ENEMIES',
  'EXTRA_FLOOR',
  'REDRAW_FLOOR',
  'NEXT_BATTLE_AUGMENTS',
  'BOOST_DROP_RATE',
  'BOOST_EXP_RATE',
  'REDUCE_MORTALITY',
] as const satisfies string[];
type ConsumableEffectClasses = typeof CONSUMABLE_EFFECT_CLASSES;
export type ConsumableEffectClass = ConsumableEffectClasses[number];

export const CONSUMABLE_EFFECT_DOMAINS = [
  'GLOBAL',
  'DUNGEON',
  'WORLDMAP',
] as const satisfies string[];
type ConsumableEffectDomains = typeof CONSUMABLE_EFFECT_DOMAINS;
export type ConsumableEffectDomain = ConsumableEffectDomains[number];

// Domain each effect declares in Godot (get_domain()). Drives editor domain-validity:
// a consumable may not mix DUNGEON and WORLDMAP effects (Consumable.is_domain_valid()).
export const CONSUMABLE_EFFECT_CLASS_DOMAINS: Record<
  ConsumableEffectClass,
  ConsumableEffectDomain
> = {
  GRANT_MOVEMENT: 'WORLDMAP',
  GRANT_ACTION: 'WORLDMAP',
  WARP_TO_RESPAWN: 'WORLDMAP',
  REDUCE_ARMY_AGGRO: 'WORLDMAP',
  RESTORE_PARTY_HEALTH: 'DUNGEON',
  REVEAL_FLOOR: 'DUNGEON',
  EXPAND_VISION: 'DUNGEON',
  MARK_CHESTS: 'DUNGEON',
  MARK_ENEMIES: 'DUNGEON',
  FREEZE_ENEMIES: 'DUNGEON',
  DISABLE_ENEMY_AGGRO: 'DUNGEON',
  REDUCE_ENEMY_VISION: 'DUNGEON',
  ESCAPE_ROPE: 'DUNGEON',
  UNLOCK_DOORS: 'DUNGEON',
  SPAWN_ENEMIES: 'DUNGEON',
  EXTRA_FLOOR: 'DUNGEON',
  REDRAW_FLOOR: 'DUNGEON',
  NEXT_BATTLE_AUGMENTS: 'GLOBAL',
  BOOST_DROP_RATE: 'GLOBAL',
  BOOST_EXP_RATE: 'GLOBAL',
  REDUCE_MORTALITY: 'GLOBAL',
};

// Effects extending DurationalConsumableEffect (carry duration + save_key). The form shows
// the duration input for these, except NEXT_BATTLE_AUGMENTS (NEXT_BATTLE clock ignores it).
export const DURATIONAL_EFFECT_CLASSES = [
  'REDUCE_ARMY_AGGRO',
  'EXPAND_VISION',
  'FREEZE_ENEMIES',
  'DISABLE_ENEMY_AGGRO',
  'REDUCE_ENEMY_VISION',
  'NEXT_BATTLE_AUGMENTS',
  'BOOST_DROP_RATE',
  'BOOST_EXP_RATE',
  'REDUCE_MORTALITY',
] as const satisfies ConsumableEffectClass[];

export const isDurationalEffectClass = (effectClass: ConsumableEffectClass): boolean =>
  (DURATIONAL_EFFECT_CLASSES as ReadonlyArray<ConsumableEffectClass>).includes(effectClass);

export const HEAL_MODES = ['FLAT', 'PERCENT', 'FULL'] as const satisfies string[];
type HealModes = typeof HEAL_MODES;
export type HealMode = HealModes[number];

export type GrantMovementProps = { moves: number };
export type GrantActionProps = { actions: number };
export type ReduceArmyAggroProps = { reduction: number };
export type RestorePartyHealthProps = { mode: HealMode; amount: number };
export type ExpandVisionProps = { bonus_radius: number };
export type ReduceEnemyVisionProps = { reduction: number };
export type SpawnEnemiesProps = { count: number };
export type NextBattleAugmentsProps = {
  player_army_augments: Array<string>;
  enemy_army_augments: Array<string>;
  global_augments: Array<string>;
};
export type BoostDropRateProps = { multiplier: number; rarity_pressure_multiplier: number };
export type BoostExpRateProps = { multiplier: number };
export type ReduceMortalityProps = { multiplier: number };

// One effect entry carries every per-class prop bucket (mirroring AugmentEffect); IngestData
// reads only the bucket matching effect_class. duration/save_key apply to durational effects;
// save_key is auto-generated (UUID) and never surfaced in the UI.
export type ConsumableEffect = {
  effect_class: ConsumableEffectClass;
  duration: number;
  save_key: string;
  grant_movement_props: GrantMovementProps;
  grant_action_props: GrantActionProps;
  reduce_army_aggro_props: ReduceArmyAggroProps;
  restore_party_health_props: RestorePartyHealthProps;
  expand_vision_props: ExpandVisionProps;
  reduce_enemy_vision_props: ReduceEnemyVisionProps;
  spawn_enemies_props: SpawnEnemiesProps;
  next_battle_augments_props: NextBattleAugmentsProps;
  boost_drop_rate_props: BoostDropRateProps;
  boost_exp_rate_props: BoostExpRateProps;
  reduce_mortality_props: ReduceMortalityProps;
};

export type ConsumableProps = {
  effects: Array<ConsumableEffect>;
  consumed_on_use: boolean;
};
