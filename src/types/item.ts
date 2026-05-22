import { AugmentEffect, SharedAugmentData } from './augment';
import { Role } from './unit';

export const ITEM_TYPES = ['ITEM', 'EQUIPMENT'] as const satisfies string[];
type ItemTypes = typeof ITEM_TYPES;
export type ItemType = ItemTypes[number];

export const LOOT_CATEGORIES = [
  'WEAPON',
  'ARMOR',
  'MATERIAL',
  'MEADOWMERE',
  'WOODMERE',
] as const satisfies string[];
type LootCategories = typeof LOOT_CATEGORIES;
export type LootCategory = LootCategories[number];

export type Item = {
  guid: string;
  id: string;
  name: string;
  description: string;
  item_type: ItemType;
  gold_value: number;
  sellable: boolean;
  rarity: number;
  loot_categories: Array<LootCategory>;
  equipment_props: EquipmentProps;
};

export type EquipmentProps = {
  effects: Array<string>;
  everlasting: boolean;
  slot: number;
  quality: number;
  for_role: Array<Role>;
  shared_augment_data: SharedAugmentData;
  augment_effects: Array<AugmentEffect>;
};
