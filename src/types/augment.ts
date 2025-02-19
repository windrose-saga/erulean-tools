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
] as const satisfies string[];
type AugmentTargets = typeof AUGMENT_TARGETS;
export type AugmentTarget = AugmentTargets[number];

export const AUGMENT_BUFF_TYPES = ['BUFF', 'DEBUFF'] as const satisfies string[];
type AugmentBuffTypes = typeof AUGMENT_BUFF_TYPES;
export type AugmentBuffType = AugmentBuffTypes[number];

export const AUGMENT_DOMAINS = ['UNIT', 'ARMY', 'GLOBAL'] as const satisfies string[];
type AugmentDomains = typeof AUGMENT_DOMAINS;
export type AugmentDomain = AugmentDomains[number];

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
  domain: AugmentDomain;
  durational: boolean;
  duration: number;
  augment_class: AugmentType;
  dot_augment_props: DotAugmentProps;
  flat_stat_props: FlatStatProps;
  stat_mult_props: StatMultProps;
};

export type DotAugmentProps = {
  flat_damage: number;
  phys_def_reduction_modifier: number;
  spec_def_reduction_modifier: number;
  resource: AugmentResources;
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
