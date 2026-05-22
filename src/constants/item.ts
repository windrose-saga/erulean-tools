import { DEFAULT_SHARED_AUGMENT_DATA } from './augment';

import { EquipmentProps, Item } from '../types/item';

export const DEFAULT_EQUIPMENT_PROPS: EquipmentProps = {
  effects: [],
  everlasting: false,
  slot: 0,
  quality: 0,
  for_role: [],
  shared_augment_data: DEFAULT_SHARED_AUGMENT_DATA,
  augment_effects: [],
};

export const DEFAULT_ITEM_DATA: Item = {
  guid: '',
  id: '',
  name: '',
  description: '',
  item_type: 'ITEM',
  gold_value: 0,
  sellable: true,
  rarity: 0,
  loot_categories: [],
  equipment_props: DEFAULT_EQUIPMENT_PROPS,
};
