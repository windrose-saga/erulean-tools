export type Stats =
  | "PHYSICAL_DEFENSE"
  | "SPECIAL_DEFENSE"
  | "SPEED"
  | "STRENGTH"
  | "INTELLIGENCE"
  | "LUCK"
  | "BRAVERY"
  | "MOVEMENT";

export type AugmentType =
  | "DOT"
  | "FLAT_STAT"
  | "STAT_MULT"
  | "ALLEGIANCE"
  | "TAG"
  | "DOOM";

export type AugmentResource = "HEALTH" | "MANA";
export type AugmentTarget = Stats | AugmentResource | "DAMAGE" | "ALLEGIANCE";

export type AugmentBuffType = "BUFF" | "DEBUFF";

export type AugmentDomain = "UNIT" | "ARMY" | "GLOBAL";

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
  dot_augment_props: DotAugmentProps | null;
  flat_stat_props: FlatStatProps | null;
  stat_mult_props: StatMultProps | null;
};

export type DotAugmentProps = {
  flat_damage: number;
  phys_def_reduction_modifier: number;
  spec_def_reduction_modifier: number;
  resource: "HEALTH" | "MANA";
  resolution_type: "UNIT";
};

export type StatMultProps = {
  stat: Stats;
  multiplier: number;
};

export type FlatStatProps = {
  stat: Stats;
  amount: number;
};
