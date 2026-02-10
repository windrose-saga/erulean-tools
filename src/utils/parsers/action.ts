/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  DEFAULT_AUGMENT_ACTION_DATA,
  DEFAULT_DAMAGE_ACTION_DATA,
  DEFAULT_DISPEL_ACTION_DATA,
  DEFAULT_HEAL_ACTION_DATA,
  DEFAULT_MANA_ACTION_DATA,
  DEFAULT_SUMMON_ACTION_DATA,
  DEFAULT_TAG_ACTION_DATA,
} from '../../constants/action';
import {
  Action,
  AugmentActionData,
  DamageActionData,
  DispelActionData,
  HealActionData,
  ManaActionData,
  SummonActionData,
  TagActionData,
} from '../../types/action';
import { assertUnreachable } from '../assertUnreachable';

export const getActionData = ({
  guid,
  id,
  name,
  description,
  targeting_range,
  max_targets,
  splash,
  chain,
  max_chain_depth,
  should_check_evasion,
  evasion_multiplier,
  can_crit,
  crit_chance_multiplier,
  break_vanguard,
  delay,
  action_type,
  augment_domain,
  approach_strategy,
  target_self,
  ...line
}: any): Action => {
  const base: Action = {
    guid,
    id,
    name,
    description,
    targeting_range,
    max_targets,
    splash,
    chain,
    max_chain_depth,
    should_check_evasion,
    evasion_multiplier,
    can_crit,
    crit_chance_multiplier,
    break_vanguard,
    delay,
    action_type,
    augment_domain: augment_domain || 'UNIT',
    approach_strategy,
    target_self,
    damage_action_props: DEFAULT_DAMAGE_ACTION_DATA,
    heal_props: DEFAULT_HEAL_ACTION_DATA,
    mana_action_props: DEFAULT_MANA_ACTION_DATA,
    augment_action_props: DEFAULT_AUGMENT_ACTION_DATA,
    dispel_action_props: DEFAULT_DISPEL_ACTION_DATA,
    tag_action_props: DEFAULT_TAG_ACTION_DATA,
    summon_action_props: DEFAULT_SUMMON_ACTION_DATA,
  };

  switch (base.action_type) {
    case 'DAMAGE_ACTION':
      return { ...base, damage_action_props: getDamageActionProps(line.damage_action_props) };
    case 'HEAL':
      return { ...base, heal_props: getHealProps(line.heal_props) };
    case 'MANA_ACTION':
      return { ...base, mana_action_props: getManaActionProps(line.mana_action_props) };
    case 'AUGMENT_ACTION':
      return { ...base, augment_action_props: getAugmentActionProps(line.augment_action_props) };
    case 'DISPEL_ACTION':
      return { ...base, dispel_action_props: getDispelActionProps(line.dispel_action_props) };
    case 'TAG_ACTION':
      return { ...base, tag_action_props: getTagActionProps(line.tag_action_props) };
    case 'SUMMON_ACTION':
      return { ...base, summon_action_props: getSummonActionProps(line.summon_action_props) };
    default:
      return assertUnreachable(base.action_type);
  }
};

const getDamageActionProps = ({
  base_phys_damage,
  unit_strength_modifier,
  target_phys_defense_modifier,
  base_magic_damage,
  unit_int_modifier,
  target_spec_defense_modifier,
  base_dex_damage,
  unit_speed_modifier,
  target_speed_modifier,
  crit_modifier,
  base_damage,
  total_damage_multiplier,
  target_augment_self,
  augment,
  crit_augment,
}: any): DamageActionData => ({
  base_phys_damage,
  unit_strength_modifier,
  target_phys_defense_modifier,
  base_magic_damage,
  unit_int_modifier,
  target_spec_defense_modifier,
  base_dex_damage,
  unit_speed_modifier,
  target_speed_modifier,
  crit_modifier,
  base_damage,
  total_damage_multiplier,
  target_augment_self,
  augment: augment || null,
  crit_augment: crit_augment || null,
});

const getHealProps = ({ hp, decay, should_target_full_hp }: any): HealActionData => ({
  hp,
  decay,
  should_target_full_hp,
});

const getManaActionProps = ({
  should_target_enemy,
  mana_amount,
  should_target_full_mp,
  tag_augment,
}: any): ManaActionData => ({
  should_target_enemy,
  mana_amount,
  should_target_full_mp,
  tag_augment,
});

const getAugmentActionProps = ({
  augments,
  crit_augments,
  should_reapply,
  should_target_enemy,
}: any): AugmentActionData => ({
  augments: augments.map((augment: any) => augment.augment),
  crit_augments,
  should_reapply,
  should_target_enemy,
});

const getDispelActionProps = ({
  mode,
  domain,
  target,
  augment_name,
  unique_identifier,
  type,
  force_dispel,
  force_on_crit,
  should_target_enemy,
  only_target_augmented_units,
  ignore_target_allegiance,
}: any): DispelActionData => ({
  mode,
  domain,
  target,
  augment_name,
  unique_identifier,
  type,
  force_dispel,
  force_on_crit,
  should_target_enemy,
  only_target_augmented_units,
  ignore_target_allegiance,
});

const getTagActionProps = ({
  tag_augment,
  should_target_enemy,
  follow_tagged_unit,
}: any): TagActionData => ({
  tag_augment,
  should_target_enemy,
  follow_tagged_unit,
});

const getSummonActionProps = ({
  summons,
  summoning_range,
  should_target_enemy,
  summon_augment,
  should_summon_impact_morale,
}: any): SummonActionData => ({
  summons: summons.map((summon: any) => summon.summon),
  summoning_range,
  should_target_enemy,
  summon_augment: summon_augment || null,
  should_summon_impact_morale,
});
