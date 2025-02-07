import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { FieldValues, Path, useFormContext, useFormState } from 'react-hook-form';

import LabeledSelect from './LabledSelect';

import { useActions } from '../store/getters/action';

export interface FormActionSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FormActionSelect = <T extends FieldValues>({ label, id }: FormActionSelectProps<T>) => {
  const actions = useActions();
  const { watch } = useFormContext<T>();
  const { isDirty } = useFormState();
  const navigate = useNavigate();

  const value = watch(id) ?? null;

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

  const onViewPress = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (isDirty) {
        // eslint-disable-next-line no-alert
        if (!window.confirm('Are you sure you want to navigate away?')) {
          return;
        }
      }
      navigate({ to: `/actions/${value}` });
    },
    [isDirty, navigate, value],
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

export default FormActionSelect;
