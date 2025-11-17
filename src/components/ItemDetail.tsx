import React from 'react';

import { ItemForm } from './forms/ItemForm';

import { useItem } from '../store/getters/item';

export const ItemDetail: React.FC<{ itemId: string }> = ({ itemId }) => {
  const item = useItem(itemId);

  return <ItemForm item={item} />;
};
