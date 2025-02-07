import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { FieldValues, Path, useFormContext, useFormState } from 'react-hook-form';

import LabeledSelect, { LabeledSelectProps } from './LabledSelect';

export interface FormActionSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}
export interface LabledSelectWithDetailProps<T extends FieldValues> extends LabeledSelectProps<T> {
  label: string;
  id: Path<T>;
  options: Array<{ name: string; value: string }>;
  pathBase: string;
}

const LabledSelectWithDetail = <T extends FieldValues>({
  label,
  id,
  options,
  pathBase,
}: LabledSelectWithDetailProps<T>) => {
  const { watch } = useFormContext<T>();
  const { isDirty } = useFormState();
  const navigate = useNavigate();

  const value = watch(id) ?? null;

  const onViewPress = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (isDirty) {
        // eslint-disable-next-line no-alert
        if (!window.confirm('Are you sure you want to navigate away?')) {
          return;
        }
      }
      navigate({ to: `/${pathBase}/${value}` });
    },
    [isDirty, navigate, value, pathBase],
  );

  return (
    <div className="flex flex-col">
      <LabeledSelect id={id} label={label} options={options} />
      <button disabled={!value} className="h-min shrink-0" onClick={onViewPress}>
        View
      </button>
    </div>
  );
};

export default LabledSelectWithDetail;
