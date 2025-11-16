import { Item } from '../types/item';

export const DEFAULT_EQUIPMENT_PROPS = {
  effects: [],
};

export const DEFAULT_ITEM_DATA: Item = {
  guid: '',
  id: '',
  name: '',
  description: '',
  item_type: 'ITEM',
  equipment_props: DEFAULT_EQUIPMENT_PROPS,
};
