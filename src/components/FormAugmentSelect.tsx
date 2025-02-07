import * as React from 'react';
import { FieldValues, Path } from 'react-hook-form';

import LabledSelectWithDetail from './LabledSelectWithDetail';

import { useAugments } from '../store/getters/augment';

export interface FormAugmentSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FormAugmentSelect = <T extends FieldValues>({ label, id }: FormAugmentSelectProps<T>) => {
  const augments = useAugments();

  const options = React.useMemo(
    () =>
      augments
        .map((augment) => ({
          name: augment.name,
          value: augment.guid,
        }))
        .concat([{ name: '(None)', value: '' }]),
    [augments],
  );

  return <LabledSelectWithDetail id={id} label={label} options={options} pathBase="augments" />;
};

export default FormAugmentSelect;
