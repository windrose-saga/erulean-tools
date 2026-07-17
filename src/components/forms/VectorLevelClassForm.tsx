import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { VectorLevelClass } from '../../types/levelClass';
import { VOCAB_ID_PATTERN } from '../../utils/vocabId';
import LabeledInputBase, { LabeledInputProps } from '../LabledInput';

// Editor form shape: the stored `levels` vectors and the parallel `max_units` cap curve are
// zipped into a single per-level row list so adding/removing a level affects both together,
// then split back apart on save. Kept distinct from VectorLevelClass, whose `levels` is a
// bare Vector2[] that cannot host the cap field.
type VectorFormShape = {
  guid: string;
  id: string;
  name: string;
  levels: Array<{ x: number; y: number; max_units: number }>;
};

const DEFAULT_MAX_UNITS = 4;

const LabeledInput = (props: LabeledInputProps<VectorFormShape>) => (
  <LabeledInputBase<VectorFormShape> {...props} />
);

export interface VectorLevelClassFormProps {
  levelClass: VectorLevelClass;
  others: VectorLevelClass[];
  onSave: (levelClass: VectorLevelClass) => void;
  routeBase: string;
  levelLabel: string;
  withMaxUnits?: boolean;
}

const toForm = (levelClass: VectorLevelClass): VectorFormShape => ({
  guid: levelClass.guid,
  id: levelClass.id,
  name: levelClass.name,
  levels: levelClass.levels.map((level, index) => ({
    x: level.x,
    y: level.y,
    max_units: levelClass.max_units?.[index] ?? DEFAULT_MAX_UNITS,
  })),
});

export const VectorLevelClassForm: React.FC<VectorLevelClassFormProps> = ({
  levelClass,
  others,
  onSave,
  routeBase,
  levelLabel,
  withMaxUnits = false,
}) => {
  const navigate = useNavigate();
  const methods = useForm<VectorFormShape>({
    defaultValues: toForm(levelClass),
    mode: 'onChange',
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'levels' });

  const initialId = levelClass.id;
  const validateId = React.useCallback(
    (id: string) => {
      if (others.some((element) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [others, initialId],
  );

  const onSubmit: SubmitHandler<VectorFormShape> = (data) => {
    onSave({
      guid: levelClass.guid,
      id: data.id,
      name: data.name,
      levels: data.levels.map((l) => ({ x: Number(l.x), y: Number(l.y) })),
      ...(withMaxUnits ? { max_units: data.levels.map((l) => Number(l.max_units)) } : {}),
    });
    navigate({ to: `/${routeBase}` });
  };

  const buttonText = isDirty ? 'Cancel' : 'Back';
  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: `/${routeBase}` });
  }, [isDirty, navigate, reset, routeBase]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 mb-6 p-6">
          <LabeledInput
            id="id"
            label="ID"
            type="text"
            validate={validateId}
            pattern={{
              value: VOCAB_ID_PATTERN,
              message: 'ID must be an upper-case identifier and cannot start with a digit.',
            }}
            required
          />
          <LabeledInput id="name" label="Name" type="text" required />
          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-500 active:bg-gray-600 disabled:bg-gray-300 border-white rounded p-3 w-36"
              type="submit"
              disabled={!isDirty || !isValid}
            >
              Save
            </button>
            <button
              className="bg-gray-500 active:bg-gray-600 border-white rounded p-3 w-36"
              type="button"
              onClick={onButtonPress}
            >
              {buttonText}
            </button>
          </div>
        </div>
        <div className="border rounded gap-3 mb-6 p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Levels</h3>
            <button
              className="bg-gray-500 active:bg-gray-600 border-white rounded p-2"
              type="button"
              onClick={() => append({ x: 1, y: 1, max_units: DEFAULT_MAX_UNITS })}
            >
              Add Level
            </button>
          </div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={`grid ${
                withMaxUnits ? 'grid-cols-4' : 'grid-cols-3'
              } border rounded justify-items-center items-end gap-3 mb-3 p-3`}
            >
              <LabeledInput
                id={`levels.${index}.x`}
                label={`Level ${index} ${levelLabel} X`}
                type="number"
                allowFloats={false}
                minValue={1}
                required
              />
              <LabeledInput
                id={`levels.${index}.y`}
                label={`Level ${index} ${levelLabel} Y`}
                type="number"
                allowFloats={false}
                minValue={1}
                required
              />
              {withMaxUnits && (
                <LabeledInput
                  id={`levels.${index}.max_units`}
                  label={`Level ${index} Max Units`}
                  type="number"
                  allowFloats={false}
                  minValue={1}
                  required
                />
              )}
              <button
                className="bg-gray-500 active:bg-gray-600 border-white rounded p-2 w-full"
                type="button"
                onClick={() => remove(index)}
              >
                Remove Level {index}
              </button>
            </div>
          ))}
        </div>
      </form>
    </FormProvider>
  );
};
