export type Stats =
  | 'PHYSICAL_DEFENSE'
  | 'SPECIAL_DEFENSE'
  | 'SPEED'
  | 'STRENGTH'
  | 'INTELLIGENCE'
  | 'LUCK'
  | 'BRAVERY'
  | 'MOVEMENT';

export type AugmentType = 'DOT' | 'FLAT_STAT' | 'STAT_MULT' | 'ALLEGIANCE' | 'TAG' | 'DOOM';

export type AugmentResource = 'HEALTH' | 'MANA';
export type AugmentTarget = Stats | AugmentResource | 'DAMAGE' | 'ALLEGIANCE';

export type AugmentBuffType = 'BUFF' | 'DEBUFF';

export type AugmentDomain = 'UNIT' | 'ARMY' | 'GLOBAL';

export type AugmentBase = {
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
};

export type DotAugmentProps = {
  augment_class: 'DOT';
  flat_damage: number;
  phys_def_reduction_modifier: number;
  spec_def_reduction_modifier: number;
  resource: 'HEALTH' | 'MANA';
  resolution_type: 'UNIT';
};

export type StatMultProps = {
  augment_class: 'STAT_MULT';
  stat: Stats;
  multiplier: number;
};

export type FlatStatProps = {
  augment_class: 'FLAT_STAT';
  stat: Stats;
  amount: number;
};

export type AllegianceAugmentProps = {
  augment_class: 'ALLEGIANCE';
};

export type TagAugmentProps = {
  augment_class: 'TAG';
};

export type DoomAugmentProps = {
  augment_class: 'DOOM';
};

export type DotAugment = AugmentBase & DotAugmentProps;
export type StatMultAugment = AugmentBase & StatMultProps;
export type FlatStatAugment = AugmentBase & FlatStatProps;
export type AllegianceAugment = AugmentBase & AllegianceAugmentProps;
export type TagAugment = AugmentBase & TagAugmentProps;
export type DoomAugment = AugmentBase & DoomAugmentProps;

export type Augment =
  | DotAugment
  | StatMultAugment
  | FlatStatAugment
  | AllegianceAugment
  | TagAugment
  | DoomAugment;
