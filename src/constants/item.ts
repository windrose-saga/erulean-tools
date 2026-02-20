import { DEFAULT_SHARED_AUGMENT_DATA } from './augment';

import { EquipmentProps, Item } from '../types/item';

export const DEFAULT_EQUIPMENT_PROPS: EquipmentProps = {
  effects: [],
  everlasting: false,
  shared_augment_data: DEFAULT_SHARED_AUGMENT_DATA,
  augment_effects: [],
};

export const DEFAULT_ITEM_DATA: Item = {
  guid: '',
  id: '',
  name: '',
  description: '',
  item_type: 'ITEM',
  equipment_props: DEFAULT_EQUIPMENT_PROPS,
};
