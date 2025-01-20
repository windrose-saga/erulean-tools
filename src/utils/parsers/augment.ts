import {
  Augment,
  AugmentBase,
  DotAugmentProps,
  FlatStatProps,
  StatMultProps,
} from "../../types/augment";
import { assertUnreachable } from "../assertUnreachable";

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
  const base: AugmentBase = {
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
  };

  switch (base.augment_class) {
    case "DOT":
      return { ...base, ...getDotAugmentProps(line.dot_augment_props) };
    case "FLAT_STAT":
      return { ...base, ...getFlatStatProps(line.flat_stat_props) };
    case "STAT_MULT":
      return { ...base, ...getStatMultProps(line.stat_mult_props) };
    case "ALLEGIANCE":
    case "TAG":
    case "DOOM":
      return { ...base, augment_class };
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
    augment_class: "DOT",
    flat_damage,
    phys_def_reduction_modifier,
    spec_def_reduction_modifier,
    resource,
    resolution_type,
  } as DotAugmentProps);

const getFlatStatProps = ({ stat, amount }: any) =>
  ({
    augment_class: "FLAT_STAT",
    stat,
    amount,
  } as FlatStatProps);

const getStatMultProps = ({ stat, multiplier }: any) =>
  ({
    augment_class: "STAT_MULT",
    stat,
    multiplier,
  } as StatMultProps);
