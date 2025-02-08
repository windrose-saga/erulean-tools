import * as React from 'react';
import { FieldValues, Path } from 'react-hook-form';

import LabledSelectWithDetail from './LabledSelectWithDetail';

import { useUnits } from '../store/getters/unit';

export interface FormUnitSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FormUnitSelect = <T extends FieldValues>({ label, id }: FormUnitSelectProps<T>) => {
  const units = useUnits();

  const options = React.useMemo(
    () =>
      units
        .map((unit) => ({
          name: unit.name,
          value: unit.guid,
        }))
        .concat([{ name: '(None)', value: '' }]),
    [units],
  );

  return <LabledSelectWithDetail id={id} label={label} options={options} pathBase="units" />;
};

export default FormUnitSelect;
