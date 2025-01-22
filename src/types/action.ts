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

export type ActionBase = {
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
};

export type DamageActionData = {
  action_type: 'DAMAGE_ACTION';
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
  action_type: 'HEAL';
  hp: number;
  decay: number;
  should_target_full_hp: boolean;
};

export type ManaActionData = {
  action_type: 'MANA_ACTION';
  should_target_enemy: boolean;
  mana_amount: number;
  should_target_full_mp: boolean;
  tag_augment: string | null;
};

export type AugmentActionData = {
  action_type: 'AUGMENT_ACTION';
  augments: Array<string>;
  crit_augments: Array<string>;
  should_reapply: boolean;
  should_target_enemy: boolean;
};

export type DispelActionData = {
  action_type: 'DISPEL_ACTION';
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
  action_type: 'TAG_ACTION';
  tag_augment: string;
  should_target_enemy: boolean;
  follow_tagged_unit: boolean;
};

export type SummonActionData = {
  action_type: 'SUMMON_ACTION';
  summons: Array<string>;
  summoning_range: number;
  should_target_enemy: boolean;
  summon_augment: string;
  should_summon_impact_morale: boolean;
};

export type DamageAction = ActionBase & DamageActionData;
export type HealAction = ActionBase & HealActionData;
export type ManaAction = ActionBase & ManaActionData;
export type AugmentAction = ActionBase & AugmentActionData;
export type DispelAction = ActionBase & DispelActionData;
export type TagAction = ActionBase & TagActionData;
export type SummonAction = ActionBase & SummonActionData;

export type Action =
  | DamageAction
  | HealAction
  | ManaAction
  | AugmentAction
  | DispelAction
  | TagAction
  | SummonAction;
