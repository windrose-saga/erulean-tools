import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useAugments } from '../store/getters/augment';
import { Augment } from '../types/augment';
import { Column } from '../types/list';

const augmentColumns: Column<Augment>[] = [
  { name: 'Name', field: 'name' },
  { name: 'Augment Class', field: 'augment_class' },
  { name: 'Type', field: 'type' },
  { name: 'Durational', field: 'durational' },
  { name: 'Duration', field: 'duration' },
  { name: 'Undispellable', field: 'undispellable' },
  { name: 'Unique', field: 'unique' },
  { name: 'Unique Identifier', field: 'unique_identifier' },
  { name: 'Replenishable', field: 'replenishable' },
];

const searchFields: (keyof Augment)[] = [
  'name',
  'id',
  'description',
  'augment_class',
  'unique_identifier',
];

export const AugmentList = () => {
  const navigate = useNavigate();
  const augments = useAugments();
  const onRowClick = React.useCallback(
    (augment: Augment) => {
      navigate({ to: '/augments/$augmentId', params: { augmentId: augment.guid } });
    },
    [navigate],
  );
  return (
    <List
      items={augments}
      columns={augmentColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      objectCreationType="augment"
    />
  );
};
