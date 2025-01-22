/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Action,
  ActionBase,
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
  targeting_type,
  targeting_range,
  max_targets,
  splash,
  chain,
  should_check_evasion,
  evasion_multiplier,
  can_crit,
  crit_chance_multiplier,
  mana_delta,
  break_vanguard,
  delay,
  action_type,
  approach_strategy,
  target_self,
  ...line
}: any): Action => {
  const base: ActionBase = {
    guid,
    id,
    name,
    description,
    targeting_type,
    targeting_range,
    max_targets,
    splash,
    chain,
    should_check_evasion,
    evasion_multiplier,
    can_crit,
    crit_chance_multiplier,
    mana_delta,
    break_vanguard,
    delay,
    action_type,
    approach_strategy,
    target_self,
  };

  switch (base.action_type) {
    case 'DAMAGE_ACTION':
      return { ...base, ...getDamageActionProps(line.damage_action_props) };
    case 'HEAL':
      return { ...base, ...getHealProps(line.heal_props) };
    case 'MANA_ACTION':
      return { ...base, ...getManaActionProps(line.mana_action_props) };
    case 'AUGMENT_ACTION':
      return { ...base, ...getAugmentActionProps(line.augment_action_props) };
    case 'DISPEL_ACTION':
      return { ...base, ...getDispelActionProps(line.dispel_action_props) };
    case 'TAG_ACTION':
      return { ...base, ...getTagActionProps(line.tag_action_props) };
    case 'SUMMON_ACTION':
      return { ...base, ...getSummonActionProps(line.summon_action_props) };
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
}: any): DamageActionData => ({
  action_type: 'DAMAGE_ACTION',
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
  augment: null,
  crit_augment: null,
});

const getHealProps = ({ hp, decay, should_target_full_hp }: any): HealActionData => ({
  action_type: 'HEAL',
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
  action_type: 'MANA_ACTION',
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
  action_type: 'AUGMENT_ACTION',
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
  action_type: 'DISPEL_ACTION',
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
  action_type: 'TAG_ACTION',
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
  action_type: 'SUMMON_ACTION',
  summons: summons.map((summon: any) => summon.summon),
  summoning_range,
  should_target_enemy,
  summon_augment: summon_augment || null,
  should_summon_impact_morale,
});
