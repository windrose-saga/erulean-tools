import React from 'react';

import { ItemForm } from './forms/ItemForm';

import { DEFAULT_ITEM_DATA } from '../constants/item';

export const CreateItem: React.FC = () => {
  const item = React.useMemo(() => ({ ...DEFAULT_ITEM_DATA, guid: crypto.randomUUID() }), []);

  return <ItemForm item={item} />;
};
