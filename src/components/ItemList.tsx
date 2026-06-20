import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useItems } from '../store/getters/item';
import { useGameStore } from '../store/useGameStore';
import { ITEM_TYPES, Item } from '../types/item';
import { Column } from '../types/list';

const itemColumns: Column<Item>[] = [
  { name: 'Name', field: 'name', editable: true },
  { name: 'Type', field: 'item_type', editable: true, options: ITEM_TYPES },
  { name: 'Rarity', field: 'rarity', editable: true },
];

const searchFields: (keyof Item)[] = ['name', 'id', 'description', 'item_type'];

export const ItemList = () => {
  const navigate = useNavigate();
  const items = useItems();
  const setItem = useGameStore.use.setItem();
  const onRowClick = React.useCallback(
    (item: Item) => {
      navigate({ to: '/items/$itemId', params: { itemId: item.guid } });
    },
    [navigate],
  );
  const onCellEdit = React.useCallback(
    <K extends keyof Item>(item: Item, field: K, value: Item[K]) => {
      setItem({ ...item, [field]: value });
    },
    [setItem],
  );
  return (
    <List
      items={items}
      columns={itemColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      onCellEdit={onCellEdit}
      objectCreationType="item"
    />
  );
};
