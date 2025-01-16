export type TargetingType = "EXACT" | "UP_TO" | "SELF";
export type ApproachStrategy = "HOLD" | "PROCEED";
export type ActionType =
  | "DAMAGE_ACTION"
  | "HEAL"
  | "MANA_ACTION"
  | "AUGMENT_ACTION"
  | "DISPEL_ACTION"
  | "TAG_ACTION"
  | "SUMMON_ACTION";
export type ActionData = {
  guid: string;
  id: string;
  name: string;
  description: string;
  targetingType: TargetingType;
  targetingRange: number;
  maxTargets: number;
  splash: number;
  chain: boolean;
  shouldCheckEvasion: boolean;
  evasionMultiplier: number;
  canCrit: boolean;
  critChanceMultiplier: number;
  manaDelta: number;
  breakVanguard: boolean;
  delay: number;
  approachStrategy: ApproachStrategy;
  targetSelf: boolean;
  actionType: ActionType;
  damageActionProps: DamageActionData | undefined;
  healProps: HealActionData | undefined;
  manaActionProps: ManaActionData | undefined;
  augmentActionProps: AugmentActionData | undefined;
  dispelActionProps: DispelActionData | undefined;
  tagActionProps: TagActionData | undefined;
  summonActionProps: SummonActionData | undefined;
};

export type DamageActionData = {
  basePhysDamage: number;
  unitStrengthModifier: number;
  targetPhysDefenseModifier: number;
  baseMagicDamage: number;
  unitIntModifier: number;
  targetSpecDefenseModifier: number;
  baseDexDamage: number;
  unitSpeedModifier: number;
  targetSpeedModifier: number;
  critModifier: number;
  baseDamage: number;
  totalDamageMultiplier: number;
  targetAugmentSelf: boolean;
  augment: string | null;
  critAugment: string | null;
};

export type HealActionData = {
  hp: number;
  decay: number;
  shouldTargetFullHp: boolean;
};

export type ManaActionData = {
  shouldTargetEnemy: boolean;
  manaAmount: number;
  shouldTargetFullMp: boolean;
  tagAugment: string | null;
};

export type AugmentActionData = {
  augments: Array<string>;
  critAugments: Array<string>;
  shouldReapply: boolean;
  shouldTargetEnemy: boolean;
};

export type DispelActionData = {
  mode: "TARGET" | "ALL" | "NAME" | "UNIQUE_IDENTIFIER" | "TYPE";
  domain: "UNIT" | "ARMY" | "GLOBAL";
  target: AugmentTarget;
  augmentName: string;
  uniqueIdentifier: string;
  type: AugmentBuffType;
  forceDispel: boolean;
  forceOnCrit: boolean;
  shouldTargetEnemy: boolean;
  onlyTargetAugmentedUnits: boolean;
  ignoreTargetAllegiance: boolean;
};

export type TagActionData = {
  tagAugment: string;
  shouldTargetEnemy: boolean;
  followTaggedUnit: boolean;
};

export type SummonActionData = {
  summons: Array<{
    guid: string;
    id: string;
    summon: string;
  }>;
  summoningRange: number;
  shouldTargetEnemy: boolean;
  summonAugment: string;
  shouldSummonImpactMorale: boolean;
};

export type AugmentTarget =
  | "PHYSICAL_DEFENSE"
  | "SPECIAL_DEFENSE"
  | "SPEED"
  | "STRENGTH"
  | "INTELLIGENCE"
  | "LUCK"
  | "BRAVERY"
  | "MOVEMENT"
  | "HEALTH"
  | "MANA"
  | "DAMAGE"
  | "ALLEGIANCE";

export type AugmentBuffType = "BUFF" | "DEBUFF";
