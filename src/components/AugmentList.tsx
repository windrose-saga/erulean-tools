import { List } from './List';

import { useAugments } from '../store/getters/augment';
import { Augment } from '../types/augment';
import { Column } from '../types/list';

const augmentColumns: Column<Augment>[] = [
  { name: 'Name', field: 'name' },
  { name: 'Augment Class', field: 'augment_class' },
  { name: 'Type', field: 'type' },
  { name: 'Domain', field: 'domain' },
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
  const augments = useAugments();
  return (
    <List items={augments} columns={augmentColumns} defaultIndex="id" searchFields={searchFields} />
  );
};
