import * as React from "react";
import { CommanderData, Unit } from "../types/unit";
import useDataContext from "../context/DataContext/useDataContext";
import {
  Action,
  AugmentActionData,
  DamageActionData,
  DispelActionData,
  HealActionData,
  ManaActionData,
  SummonActionData,
  TagActionData,
} from "../types/action";
import {
  Augment,
  DotAugmentProps,
  FlatStatProps,
  StatMultProps,
} from "../types/augment";

const ACTION_SHEET_GUID = "288ae487-6d6a-411e-b468-ab415b4ba7e6";
const UNIT_SHEET_GUID = "c4ca663f-445a-4bcb-bf4e-4cd51455c0a5";
const AUGMENT_SHEET_GUID = "4d53960f-f75e-4721-ad17-90d124808b18";

const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);

  const { setUnits, setActions, setAugments } = useDataContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          try {
            const data = JSON.parse(fileReader.result as string);
            setUnits(getUnitLines(data.sheets).map(getUnitData));
            setActions(getActionLines(data.sheets).map(getActionData));
            setAugments(getAugmentLines(data.sheets).map(getAugmentData));
          } catch (error) {
            console.warn("Failed to parse JSON:", error);
          }
        }
      };
    }
  };

  return (
    <div>
      <input type="file" accept=".json,.dpo" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default Upload;

const getUnitLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === UNIT_SHEET_GUID).lines;
};

const getActionLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === ACTION_SHEET_GUID).lines;
};

const getAugmentLines = (data: Array<any>) => {
  return data.find((sheet: any) => sheet.guid === AUGMENT_SHEET_GUID).lines;
};

const getUnitData = ({
  guid,
  id,
  name,
  presentation,
  is_commander,
  max_hp,
  starting_hp,
  max_mana,
  starting_mana,
  mana_growth,
  phys_defense,
  spec_defense,
  speed,
  strength,
  intelligence,
  luck,
  bravery,
  movement,
  point_value,
  can_flee,
  faithful,
  movement_strategy,
  holding_distance,
  inaction_limit,
  actions,
  commander_data: raw_commander_data,
}: any): Unit => {
  const commanderData = is_commander
    ? getCommanderData(raw_commander_data)
    : null;

  return {
    guid,
    id,
    name,
    description: presentation.description,
    is_commander,
    commander_data: commanderData,
    max_hp,
    starting_hp,
    max_mana,
    starting_mana,
    mana_growth,
    phys_defense,
    spec_defense,
    speed,
    strength,
    intelligence,
    luck,
    bravery,
    movement,
    point_value,
    can_flee,
    faithful,
    movement_strategy,
    holding_distance,
    inaction_limit,
    actions,
  };
};

const getCommanderData = ({
  leadership,
  point_limit,
  grid_size_x,
  grid_size_y,
  global_augments,
  army_augments,
  enemy_army_augments,
  army_name,
}: any): CommanderData => {
  return {
    leadership,
    point_limit,
    grid_size_x,
    grid_size_y,
    global_augments,
    army_augments,
    enemy_army_augments,
    army_name,
  };
};

const getActionData = (line: any): Action => {
  const {
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
  } = line;

  const action: Action = {
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
    damage_action_props: undefined,
    heal_props: undefined,
    mana_action_props: undefined,
    augment_action_props: undefined,
    dispel_action_props: undefined,
    tag_action_props: undefined,
    summon_action_props: undefined,
  };

  switch (action.action_type) {
    case "DAMAGE_ACTION":
      action.damage_action_props = getDamageActionProps(
        line.damage_action_props
      );
      break;
    case "HEAL":
      action.heal_props = getHealProps(line.heal_props);
      break;
    case "MANA_ACTION":
      action.mana_action_props = getManaActionProps(line.mana_action_props);
      break;
    case "AUGMENT_ACTION":
      action.augment_action_props = getAugmentActionProps(
        line.augment_action_props
      );
      break;
    case "DISPEL_ACTION":
      action.dispel_action_props = getDispelActionProps(
        line.dispel_action_props
      );
      break;
    case "TAG_ACTION":
      action.tag_action_props = getTagActionProps(line.tag_action_props);
      break;
    case "SUMMON_ACTION":
      action.summon_action_props = getSummonActionProps(
        line.summon_action_props
      );
      break;
  }

  return action;
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

const getHealProps = ({
  hp,
  decay,
  should_target_full_hp,
}: any): HealActionData => ({
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
  augments,
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
  summons,
  summoning_range,
  should_target_enemy,
  summon_augment,
  should_summon_impact_morale,
});

const getAugmentData = (line: any): Augment => {
  const {
    guid,
    id,
    name,
    description,
    type,
    undispellable,
    unique,
    unique_identifier,
    replenishable,
    domain,
    durational,
    duration,
    augment_class,
  } = line;
  const augment: Augment = {
    guid,
    id,
    name,
    description,
    type,
    undispellable,
    unique,
    unique_identifier,
    replenishable,
    domain,
    durational,
    duration,
    augment_class,
    dot_augment_props: null,
    flat_stat_props: null,
    stat_mult_props: null,
  };

  switch (augment.augment_class) {
    case "DOT":
      augment.dot_augment_props = getDotAugmentProps(line.dot_augment_props);
      break;
    case "FLAT_STAT":
      augment.flat_stat_props = getFlatStatProps(line.flat_stat_props);
      break;
    case "STAT_MULT":
      augment.stat_mult_props = getStatMultProps(line.stat_mult_props);
      break;
    case "ALLEGIANCE":
    case "TAG":
    case "DOOM":
      break;
  }

  return augment;
};

const getDotAugmentProps = ({
  flat_damage,
  phys_def_reduction_modifier,
  spec_def_reduction_modifier,
  resource,
  resolution_type,
}: any): DotAugmentProps =>
  ({
    flat_damage,
    phys_def_reduction_modifier,
    spec_def_reduction_modifier,
    resource,
    resolution_type,
  } as DotAugmentProps);

const getFlatStatProps = ({ stat, amount }: any) =>
  ({
    stat,
    amount,
  } as FlatStatProps);

const getStatMultProps = ({ stat, multiplier }: any) =>
  ({
    stat,
    multiplier,
  } as StatMultProps);
