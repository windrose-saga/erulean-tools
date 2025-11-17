import * as React from 'react';
import { FieldValues, Path } from 'react-hook-form';

import LabledSelectWithDetail from './LabledSelectWithDetail';

import { useItems } from '../store/getters/item';

export interface FormItemSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FormItemSelect = <T extends FieldValues>({ label, id }: FormItemSelectProps<T>) => {
  const items = useItems();

  const options = React.useMemo(
    () =>
      items
        .map((item) => ({
          name: item.name,
          value: item.guid,
        }))
        .concat([{ name: '(None)', value: '' }]),
    [items],
  );

  return <LabledSelectWithDetail id={id} label={label} options={options} pathBase="items" />;
};

export default FormItemSelect;
