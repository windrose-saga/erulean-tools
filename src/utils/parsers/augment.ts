import {
  Augment,
  DotAugmentProps,
  FlatStatProps,
  StatMultProps,
} from "../../types/augment";

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
