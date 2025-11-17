import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useItems } from '../store/getters/item';
import { Item } from '../types/item';
import { Column } from '../types/list';

const itemColumns: Column<Item>[] = [
  { name: 'Name', field: 'name' },
  { name: 'Type', field: 'item_type' },
];

const searchFields: (keyof Item)[] = ['name', 'id', 'description', 'item_type'];

export const ItemList = () => {
  const navigate = useNavigate();
  const items = useItems();
  const onRowClick = React.useCallback(
    (item: Item) => {
      navigate({ to: '/items/$itemId', params: { itemId: item.guid } });
    },
    [navigate],
  );
  return (
    <List
      items={items}
      columns={itemColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      objectCreationType="item"
    />
  );
};
