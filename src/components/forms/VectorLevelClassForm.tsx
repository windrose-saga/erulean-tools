import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { VectorLevelClass } from '../../types/levelClass';
import { VOCAB_ID_PATTERN } from '../../utils/vocabId';
import LabeledInputBase, { LabeledInputProps } from '../LabledInput';

const LabeledInput = (props: LabeledInputProps<VectorLevelClass>) => (
  <LabeledInputBase<VectorLevelClass> {...props} />
);

export interface VectorLevelClassFormProps {
  levelClass: VectorLevelClass;
  others: VectorLevelClass[];
  onSave: (levelClass: VectorLevelClass) => void;
  routeBase: string;
  levelLabel: string;
}

export const VectorLevelClassForm: React.FC<VectorLevelClassFormProps> = ({
  levelClass,
  others,
  onSave,
  routeBase,
  levelLabel,
}) => {
  const navigate = useNavigate();
  const methods = useForm<VectorLevelClass>({ defaultValues: levelClass, mode: 'onChange' });
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

  const onSubmit: SubmitHandler<VectorLevelClass> = (data) => {
    onSave({
      guid: levelClass.guid,
      id: data.id,
      name: data.name,
      levels: data.levels.map((l) => ({ x: Number(l.x), y: Number(l.y) })),
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
              onClick={() => append({ x: 1, y: 1 })}
            >
              Add Level
            </button>
          </div>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-3 border rounded justify-items-center items-end gap-3 mb-3 p-3"
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
