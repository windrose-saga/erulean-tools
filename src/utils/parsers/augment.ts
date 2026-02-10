/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  DEFAULT_DOT_AUGMENT_PROPS,
  DEFAULT_FLAT_STAT_PROPS,
  DEFAULT_STAT_MULT_PROPS,
} from '../../constants/augment';
import { Augment, DotAugmentProps, FlatStatProps, StatMultProps } from '../../types/augment';
import { assertUnreachable } from '../assertUnreachable';

export const getAugmentData = (line: any): Augment => {
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
    durational,
    duration,
    augment_class,
  } = line;
  const base: Augment = {
    guid,
    id,
    name,
    description,
    type,
    undispellable,
    unique,
    unique_identifier,
    replenishable,
    durational,
    duration,
    augment_class,
    dot_augment_props: DEFAULT_DOT_AUGMENT_PROPS,
    stat_mult_props: DEFAULT_STAT_MULT_PROPS,
    flat_stat_props: DEFAULT_FLAT_STAT_PROPS,
  };

  switch (base.augment_class) {
    case 'DOT':
      return { ...base, dot_augment_props: getDotAugmentProps(line.dot_augment_props) };
    case 'FLAT_STAT':
      return { ...base, flat_stat_props: getFlatStatProps(line.flat_stat_props) };
    case 'STAT_MULT':
      return { ...base, stat_mult_props: getStatMultProps(line.stat_mult_props) };
    case 'ALLEGIANCE':
    case 'TAG':
    case 'DOOM':
      return base;
    default:
      return assertUnreachable(base.augment_class);
  }
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
  }) as DotAugmentProps;

const getFlatStatProps = ({ stat, amount }: any) =>
  ({
    stat,
    amount,
  }) as FlatStatProps;

const getStatMultProps = ({ stat, multiplier }: any) =>
  ({
    stat,
    multiplier,
  }) as StatMultProps;
