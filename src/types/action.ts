import { AugmentBuffType, AugmentDomain, AugmentTarget } from './augment';

export type TargetingType = 'EXACT' | 'UP_TO' | 'SELF';
export type ApproachStrategy = 'HOLD' | 'PROCEED';
export type ActionType =
  | 'DAMAGE_ACTION'
  | 'HEAL'
  | 'MANA_ACTION'
  | 'AUGMENT_ACTION'
  | 'DISPEL_ACTION'
  | 'TAG_ACTION'
  | 'SUMMON_ACTION';

export type DispelActionMode = 'TARGET' | 'ALL' | 'NAME' | 'UNIQUE_IDENTIFIER' | 'TYPE';

export type Action = {
  guid: string;
  id: string;
  name: string;
  description: string;
  targeting_type: TargetingType;
  targeting_range: number;
  max_targets: number;
  splash: number;
  chain: boolean;
  should_check_evasion: boolean;
  evasion_multiplier: number;
  can_crit: boolean;
  crit_chance_multiplier: number;
  mana_delta: number;
  break_vanguard: boolean;
  delay: number;
  approach_strategy: ApproachStrategy;
  target_self: boolean;
  action_type: ActionType;
  damage_action_props: DamageActionData;
  heal_props: HealActionData;
  mana_action_props: ManaActionData;
  augment_action_props: AugmentActionData;
  dispel_action_props: DispelActionData;
  tag_action_props: TagActionData;
  summon_action_props: SummonActionData;
};

export type DamageActionData = {
  base_phys_damage: number;
  unit_strength_modifier: number;
  target_phys_defense_modifier: number;
  base_magic_damage: number;
  unit_int_modifier: number;
  target_spec_defense_modifier: number;
  base_dex_damage: number;
  unit_speed_modifier: number;
  target_speed_modifier: number;
  crit_modifier: number;
  base_damage: number;
  total_damage_multiplier: number;
  target_augment_self: boolean;
  augment: string | null;
  crit_augment: string | null;
};

export type HealActionData = {
  hp: number;
  decay: number;
  should_target_full_hp: boolean;
};

export type ManaActionData = {
  should_target_enemy: boolean;
  mana_amount: number;
  should_target_full_mp: boolean;
  tag_augment: string | null;
};

export type AugmentActionData = {
  augments: Array<string>;
  crit_augments: Array<string>;
  should_reapply: boolean;
  should_target_enemy: boolean;
};

export type DispelActionData = {
  mode: DispelActionMode;
  domain: AugmentDomain;
  target: AugmentTarget;
  augment_name: string;
  unique_identifier: string;
  type: AugmentBuffType;
  force_dispel: boolean;
  force_on_crit: boolean;
  should_target_enemy: boolean;
  only_target_augmented_units: boolean;
  ignore_target_allegiance: boolean;
};

export type TagActionData = {
  tag_augment: string;
  should_target_enemy: boolean;
  follow_tagged_unit: boolean;
};

export type SummonActionData = {
  summons: Array<string>;
  summoning_range: number;
  should_target_enemy: boolean;
  summon_augment: string | null;
  should_summon_impact_morale: boolean;
};
