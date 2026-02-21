export const AUGMENT_STATS = [
  'PHYSICAL_DEFENSE',
  'SPECIAL_DEFENSE',
  'SPEED',
  'STRENGTH',
  'INTELLIGENCE',
  'LUCK',
  'BRAVERY',
  'MOVEMENT',
] as const satisfies string[];
type AugmentStats = typeof AUGMENT_STATS;
export type AugmentStat = AugmentStats[number];

export const AUGMENT_TYPES = [
  'DOT',
  'FLAT_STAT',
  'STAT_MULT',
  'ALLEGIANCE',
  'TAG',
  'DOOM',
  'RANGE',
  'AOE',
  'AOE_RADIUS',
  'MAX_TARGETS',
] as const satisfies string[];
type AugmentTypes = typeof AUGMENT_TYPES;
export type AugmentType = AugmentTypes[number];

export const AUGMENT_RESOURCES = ['HEALTH', 'MANA'] as const satisfies string[];
type AugmentResources = typeof AUGMENT_RESOURCES;
export type AugmentResource = AugmentResources[number];

export const AUGMENT_TARGETS = [
  ...AUGMENT_STATS,
  ...AUGMENT_RESOURCES,
  'DAMAGE',
  'ALLEGIANCE',
  'ACTION_TARGETING_RANGE',
  'ACTION_IS_AOE',
  'ACTION_AOE_RADIUS',
  'ACTION_MAX_TARGETS',
] as const satisfies string[];
type AugmentTargets = typeof AUGMENT_TARGETS;
export type AugmentTarget = AugmentTargets[number];

export const AUGMENT_BUFF_TYPES = ['BUFF', 'DEBUFF'] as const satisfies string[];
type AugmentBuffTypes = typeof AUGMENT_BUFF_TYPES;
export type AugmentBuffType = AugmentBuffTypes[number];

export const AUGMENT_DOMAINS = ['UNIT', 'ARMY', 'GLOBAL'] as const satisfies string[];
type AugmentDomains = typeof AUGMENT_DOMAINS;
export type AugmentDomain = AugmentDomains[number];

export const RANGE_AUGMENT_MODES = ['FLAT', 'MULTIPLY'] as const satisfies string[];
type RangeAugmentModes = typeof RANGE_AUGMENT_MODES;
export type RangeAugmentMode = RangeAugmentModes[number];

export const AOE_AUGMENT_MODES = ['ENABLE', 'DISABLE'] as const satisfies string[];
type AOEAugmentModes = typeof AOE_AUGMENT_MODES;
export type AOEAugmentMode = AOEAugmentModes[number];

export const AOE_RADIUS_AUGMENT_MODES = ['FLAT', 'MULTIPLY', 'REPLACE'] as const satisfies string[];
type AOERadiusAugmentModes = typeof AOE_RADIUS_AUGMENT_MODES;
export type AOERadiusAugmentMode = AOERadiusAugmentModes[number];

export const MAX_TARGETS_AUGMENT_MODES = [
  'FLAT',
  'MULTIPLY',
  'REPLACE',
] as const satisfies string[];
type MaxTargetsAugmentModes = typeof MAX_TARGETS_AUGMENT_MODES;
export type MaxTargetsAugmentMode = MaxTargetsAugmentModes[number];

export type Augment = {
  guid: string;
  id: string;
  name: string;
  description: string;
  type: AugmentBuffType;
  undispellable: boolean;
  unique: boolean;
  unique_identifier: string;
  replenishable: boolean;
  durational: boolean;
  duration: number;
  augment_class: AugmentType;
  dot_augment_props: DotAugmentProps;
  flat_stat_props: FlatStatProps;
  stat_mult_props: StatMultProps;
  range_augment_props: RangeAugmentProps;
  aoe_augment_props: AOEAugmentProps;
  aoe_radius_augment_props: AOERadiusAugmentProps;
  max_targets_augment_props: MaxTargetsAugmentProps;
};

export type DotAugmentProps = {
  flat_damage: number;
  phys_def_reduction_modifier: number;
  spec_def_reduction_modifier: number;
  resource: AugmentResource;
  resolution_type: AugmentDomain;
};

export type StatMultProps = {
  stat: AugmentStat;
  multiplier: number;
};

export type FlatStatProps = {
  stat: AugmentStat;
  amount: number;
};

export type RangeAugmentProps = {
  mode: RangeAugmentMode;
  amount: number;
};

export type AOEAugmentProps = {
  mode: AOEAugmentMode;
};

export type AOERadiusAugmentProps = {
  mode: AOERadiusAugmentMode;
  amount: number;
};

export type MaxTargetsAugmentProps = {
  mode: MaxTargetsAugmentMode;
  amount: number;
};

export type AugmentEffect = Pick<
  Augment,
  | 'augment_class'
  | 'type'
  | 'dot_augment_props'
  | 'flat_stat_props'
  | 'stat_mult_props'
  | 'range_augment_props'
  | 'aoe_augment_props'
  | 'aoe_radius_augment_props'
  | 'max_targets_augment_props'
>;

export type SharedAugmentData = Pick<
  Augment,
  'undispellable' | 'replenishable' | 'durational' | 'duration'
>;
