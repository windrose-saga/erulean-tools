import {
  Augment,
  AugmentEffect,
  DotAugmentProps,
  FlatStatProps,
  SharedAugmentData,
  StatMultProps,
} from '../types/augment';

export const DEFAULT_DOT_AUGMENT_PROPS: DotAugmentProps = {
  flat_damage: 0,
  phys_def_reduction_modifier: 0,
  spec_def_reduction_modifier: 0,
  resource: 'HEALTH',
  resolution_type: 'UNIT',
};

export const DEFAULT_STAT_MULT_PROPS: StatMultProps = {
  stat: 'PHYSICAL_DEFENSE',
  multiplier: 1,
};

export const DEFAULT_FLAT_STAT_PROPS: FlatStatProps = {
  stat: 'PHYSICAL_DEFENSE',
  amount: 0,
};

export const DEFAULT_AUGMENT_EFFECT: AugmentEffect = {
  augment_class: 'FLAT_STAT',
  type: 'BUFF',
  dot_augment_props: DEFAULT_DOT_AUGMENT_PROPS,
  flat_stat_props: DEFAULT_FLAT_STAT_PROPS,
  stat_mult_props: DEFAULT_STAT_MULT_PROPS,
};

export const DEFAULT_SHARED_AUGMENT_DATA: SharedAugmentData = {
  undispellable: false,
  replenishable: false,
  durational: false,
  duration: 0,
};

export const DEFAULT_AUGMENT: Augment = {
  guid: '',
  id: '',
  name: '',
  description: '',
  type: 'BUFF',
  undispellable: false,
  unique: false,
  unique_identifier: '',
  replenishable: false,
  durational: false,
  duration: 0,
  augment_class: 'FLAT_STAT',
  dot_augment_props: DEFAULT_DOT_AUGMENT_PROPS,
  stat_mult_props: DEFAULT_STAT_MULT_PROPS,
  flat_stat_props: DEFAULT_FLAT_STAT_PROPS,
};
