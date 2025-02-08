import * as React from 'react';
import { FieldValues, Path } from 'react-hook-form';

import LabledSelectWithDetail from './LabledSelectWithDetail';

import { useActions } from '../store/getters/action';

export interface FormActionSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FormActionSelect = <T extends FieldValues>({ label, id }: FormActionSelectProps<T>) => {
  const actions = useActions();

  const options = React.useMemo(
    () =>
      actions
        .map((action) => ({
          name: action.name,
          value: action.guid,
        }))
        .concat([{ name: '(None)', value: '' }]),
    [actions],
  );

  return <LabledSelectWithDetail id={id} label={label} options={options} pathBase="actions" />;
};

export default FormActionSelect;
