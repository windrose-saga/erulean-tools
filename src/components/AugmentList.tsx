import { useNavigate } from '@tanstack/react-router';
import React from 'react';

import { List } from './List';

import { useAugments } from '../store/getters/augment';
import { useGameStore } from '../store/useGameStore';
import { AUGMENT_BUFF_TYPES, AUGMENT_TYPES, Augment } from '../types/augment';
import { Column } from '../types/list';

const augmentColumns: Column<Augment>[] = [
  { name: 'Name', field: 'name', editable: true },
  { name: 'Augment Class', field: 'augment_class', editable: true, options: AUGMENT_TYPES },
  { name: 'Type', field: 'type', editable: true, options: AUGMENT_BUFF_TYPES },
  { name: 'Durational', field: 'durational', editable: true },
  { name: 'Duration', field: 'duration', editable: true },
  { name: 'Undispellable', field: 'undispellable', editable: true },
  { name: 'Unique', field: 'unique', editable: true },
  { name: 'Unique Identifier', field: 'unique_identifier', editable: true },
  { name: 'Replenishable', field: 'replenishable', editable: true },
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
  const setAugment = useGameStore.use.setAugment();
  const onRowClick = React.useCallback(
    (augment: Augment) => {
      navigate({ to: '/augments/$augmentId', params: { augmentId: augment.guid } });
    },
    [navigate],
  );
  const onCellEdit = React.useCallback(
    <K extends keyof Augment>(augment: Augment, field: K, value: Augment[K]) => {
      setAugment({ ...augment, [field]: value });
    },
    [setAugment],
  );
  return (
    <List
      items={augments}
      columns={augmentColumns}
      defaultIndex="id"
      searchFields={searchFields}
      onRowClick={onRowClick}
      onCellEdit={onCellEdit}
      objectCreationType="augment"
    />
  );
};
