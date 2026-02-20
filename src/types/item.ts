import { AugmentEffect, SharedAugmentData } from './augment';

export const ITEM_TYPES = ['ITEM', 'EQUIPMENT'] as const satisfies string[];
type ItemTypes = typeof ITEM_TYPES;
export type ItemType = ItemTypes[number];

export type Item = {
  guid: string;
  id: string;
  name: string;
  description: string;
  item_type: ItemType;
  equipment_props: EquipmentProps;
};

export type EquipmentProps = {
  effects: Array<string>;
  everlasting: boolean;
  shared_augment_data: SharedAugmentData;
  augment_effects: Array<AugmentEffect>;
};
