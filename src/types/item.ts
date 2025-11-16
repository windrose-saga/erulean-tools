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

type EquipmentProps = {
  effects: Array<string>;
};
