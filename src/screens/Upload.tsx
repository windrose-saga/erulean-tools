import * as React from "react";
import { CommanderData, Unit, UnitStats } from "../types/unit";
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

const getUnitData = (line: any): Unit => {
  const stats: UnitStats = {
    maxHp: line.max_hp,
    startingHp: line.starting_hp,
    maxMana: line.max_mana,
    startingMana: line.starting_mana,
    manaGrowth: line.mana_growth,
    physDefense: line.phys_defense,
    specDefense: line.spec_defense,
    speed: line.speed,
    strength: line.strength,
    intelligence: line.intelligence,
    luck: line.luck,
    bravery: line.bravery,
    movement: line.movement,
    pointValue: line.point_value,
    canFlee: line.can_flee,
    faithful: line.faithful,
    movementStrategy: line.movement_strategy,
    holdingDistance: line.holding_distance,
    inactionLimit: line.inaction_limit,
  };

  const commanderData: CommanderData = {
    leadership: line.commander_data.leadership,
    pointLimit: line.commander_data.point_limit,
    gridSizeX: line.commander_data.grid_size_x,
    gridSizeY: line.commander_data.grid_size_y,
    globalAugments: line.commander_data.global_augments,
    armyAugments: line.commander_data.army_augments,
    enemyArmyAugments: line.commander_data.enemy_army_augments,
    armyName: line.commander_data.army_name,
  };

  return {
    guid: line.guid,
    id: line.id,
    name: line.name,
    description: line.presentation.description,
    isCommander: line.is_commander,
    commanderData,
    stats,
    actions: line.actions,
  };
};

const getActionData = (line: any): Action => {
  const action: Action = {
    guid: line.guid,
    id: line.id,
    name: line.name,
    description: line.description,
    targetingType: line.targeting_type,
    targetingRange: line.targeting_range,
    maxTargets: line.max_targets,
    splash: line.splash,
    chain: line.chain,
    shouldCheckEvasion: line.should_check_evasion,
    evasionMultiplier: line.evasion_multiplier,
    canCrit: line.can_crit,
    critChanceMultiplier: line.crit_chance_multiplier,
    manaDelta: line.mana_delta,
    breakVanguard: line.break_vanguard,
    delay: line.delay,
    actionType: line.action_type,
    approachStrategy: line.approach_strategy,
    targetSelf: line.target_self,
    damageActionProps: undefined,
    healProps: undefined,
    manaActionProps: undefined,
    augmentActionProps: undefined,
    dispelActionProps: undefined,
    tagActionProps: undefined,
    summonActionProps: undefined,
  };

  switch (action.actionType) {
    case "DAMAGE_ACTION":
      action.damageActionProps = getDamageActionProps(line.damage_action_props);
      break;
    case "HEAL":
      action.healProps = getHealProps(line.heal_props);
      break;
    case "MANA_ACTION":
      action.manaActionProps = getManaActionProps(line.mana_action_props);
      break;
    case "AUGMENT_ACTION":
      action.augmentActionProps = getAugmentActionProps(
        line.augment_action_props
      );
      break;
    case "DISPEL_ACTION":
      action.dispelActionProps = getDispelActionProps(line.dispel_action_props);
      break;
    case "TAG_ACTION":
      action.tagActionProps = getTagActionProps(line.tag_action_props);
      break;
    case "SUMMON_ACTION":
      action.summonActionProps = getSummonActionProps(line.summon_action_props);
      break;
  }

  return action;
};

const getDamageActionProps = (line: any): DamageActionData => ({
  basePhysDamage: line.base_phys_damage,
  unitStrengthModifier: line.unit_strength_modifier,
  targetPhysDefenseModifier: line.target_phys_defense_modifier,
  baseMagicDamage: line.base_magic_damage,
  unitIntModifier: line.unit_int_modifier,
  targetSpecDefenseModifier: line.target_spec_defense_modifier,
  baseDexDamage: line.base_dex_damage,
  unitSpeedModifier: line.unit_speed_modifier,
  targetSpeedModifier: line.target_speed_modifier,
  critModifier: line.crit_modifier,
  baseDamage: line.base_damage,
  totalDamageMultiplier: line.total_damage_multiplier,
  targetAugmentSelf: line.target_augment_self,
  augment: line.augment,
  critAugment: line.augment,
});

const getHealProps = (line: any): HealActionData => ({
  hp: line.hp,
  decay: line.decay,
  shouldTargetFullHp: line.should_target_full_hp,
});

const getManaActionProps = (line: any): ManaActionData => ({
  shouldTargetEnemy: line.should_target_enemy,
  manaAmount: line.mana_amount,
  shouldTargetFullMp: line.should_target_full_mp,
  tagAugment: line.tag_augment,
});

const getAugmentActionProps = (line: any): AugmentActionData => ({
  augments: line.augments,
  critAugments: line.crit_augments,
  shouldReapply: line.should_reapply,
  shouldTargetEnemy: line.should_target_enemy,
});

const getDispelActionProps = (line: any): DispelActionData => ({
  mode: line.mode,
  domain: line.domain,
  target: line.target,
  augmentName: line.augment_name,
  uniqueIdentifier: line.unique_identifier,
  type: line.type,
  forceDispel: line.force_dispel,
  forceOnCrit: line.force_on_crit,
  shouldTargetEnemy: line.should_target_enemy,
  onlyTargetAugmentedUnits: line.only_target_augmented_units,
  ignoreTargetAllegiance: line.ignore_target_allegiance,
});

const getTagActionProps = (line: any): TagActionData => ({
  tagAugment: line.tag_augment,
  shouldTargetEnemy: line.should_target_enemy,
  followTaggedUnit: line.follow_tagged_unit,
});

const getSummonActionProps = (line: any): SummonActionData => ({
  summons: line.summons,
  summoningRange: line.summoning_range,
  shouldTargetEnemy: line.should_target_enemy,
  summonAugment: line.summon_augment,
  shouldSummonImpactMorale: line.should_summon_impact_morale,
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
