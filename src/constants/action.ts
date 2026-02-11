import {
  Action,
  AugmentActionData,
  DamageActionData,
  DispelActionData,
  HealActionData,
  ManaActionData,
  SummonActionData,
  TagActionData,
} from '../types/action';

export const DEFAULT_DAMAGE_ACTION_DATA: DamageActionData = {
  base_phys_damage: 0,
  unit_strength_modifier: 0,
  target_phys_defense_modifier: 0,
  base_magic_damage: 0,
  unit_int_modifier: 0,
  target_spec_defense_modifier: 0,
  unit_speed_modifier: 0,
  crit_modifier: 2,
  base_damage: 0,
  total_damage_multiplier: 1,
  target_augment_self: false,
  augment: null,
  crit_augment: null,
};

export const DEFAULT_HEAL_ACTION_DATA: HealActionData = {
  hp: 0,
  decay: 0,
  should_target_full_hp: false,
};
export const DEFAULT_MANA_ACTION_DATA: ManaActionData = {
  should_target_enemy: false,
  mana_amount: 0,
  should_target_full_mp: false,
  tag_augment: null,
};

export const DEFAULT_AUGMENT_ACTION_DATA: AugmentActionData = {
  augments: [],
  crit_augments: [],
  should_reapply: false,
  should_target_enemy: false,
};

export const DEFAULT_DISPEL_ACTION_DATA: DispelActionData = {
  mode: 'TARGET',
  domain: 'UNIT',
  target: 'ALLEGIANCE',
  augment_name: '',
  unique_identifier: '',
  type: 'BUFF',
  force_dispel: false,
  force_on_crit: false,
  should_target_enemy: false,
  only_target_augmented_units: false,
  ignore_target_allegiance: false,
};

export const DEFAULT_TAG_ACTION_DATA: TagActionData = {
  tag_augment: '',
  should_target_enemy: false,
  follow_tagged_unit: false,
};

export const DEFAULT_SUMMON_ACTION_DATA: SummonActionData = {
  summons: [],
  summoning_range: 0,
  should_target_enemy: false,
  summon_augment: null,
  should_summon_impact_morale: false,
};

export const DEFAULT_ACTION_DATA: Action = {
  guid: '',
  id: '',
  name: '',
  description: '',
  targeting_range: 1,
  max_targets: 1,
  splash: 0,
  chain: false,
  max_chain_depth: 0,
  should_check_evasion: false,
  evasion_multiplier: 1,
  can_crit: false,
  crit_chance_multiplier: 1,
  break_vanguard: false,
  delay: 0,
  approach_strategy: 'PROCEED',
  target_self: false,
  targeting_preference: 'CLOSEST',
  is_aoe: false,
  aoe_radius: 1,
  aoe_include_self: true,
  action_type: 'DAMAGE_ACTION',
  augment_domain: 'UNIT',
  damage_action_props: DEFAULT_DAMAGE_ACTION_DATA,
  heal_props: DEFAULT_HEAL_ACTION_DATA,
  mana_action_props: DEFAULT_MANA_ACTION_DATA,
  augment_action_props: DEFAULT_AUGMENT_ACTION_DATA,
  dispel_action_props: DEFAULT_DISPEL_ACTION_DATA,
  tag_action_props: DEFAULT_TAG_ACTION_DATA,
  summon_action_props: DEFAULT_SUMMON_ACTION_DATA,
};
