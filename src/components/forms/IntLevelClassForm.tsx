import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { IntLevelClass } from '../../types/levelClass';
import { VOCAB_ID_PATTERN } from '../../utils/vocabId';
import LabeledInputBase, { LabeledInputProps } from '../LabledInput';

// Editor form shape: the stored `levels: number[]` is mapped to `{ value }[]`
// objects so react-hook-form's useFieldArray (which expects object arrays)
// behaves, then mapped back to numbers on save.
type IntFormShape = {
  guid: string;
  id: string;
  name: string;
  levels: Array<{ value: number }>;
};

const LabeledInput = (props: LabeledInputProps<IntFormShape>) => (
  <LabeledInputBase<IntFormShape> {...props} />
);

export interface IntLevelClassFormProps {
  levelClass: IntLevelClass;
  others: IntLevelClass[];
  onSave: (levelClass: IntLevelClass) => void;
  routeBase: string;
  levelLabel: string;
  warn?: (levels: number[]) => string | null;
  blockOnWarning?: boolean;
}

const toForm = (levelClass: IntLevelClass): IntFormShape => ({
  guid: levelClass.guid,
  id: levelClass.id,
  name: levelClass.name,
  levels: levelClass.levels.map((value) => ({ value })),
});

export const IntLevelClassForm: React.FC<IntLevelClassFormProps> = ({
  levelClass,
  others,
  onSave,
  routeBase,
  levelLabel,
  warn,
  blockOnWarning = false,
}) => {
  const navigate = useNavigate();
  const methods = useForm<IntFormShape>({ defaultValues: toForm(levelClass), mode: 'onChange' });
  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { isDirty, isValid },
  } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'levels' });

  const watchedLevels = watch('levels');
  const warning = warn ? warn((watchedLevels ?? []).map((level) => Number(level.value))) : null;

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

  const onSubmit: SubmitHandler<IntFormShape> = (data) => {
    onSave({
      guid: levelClass.guid,
      id: data.id,
      name: data.name,
      levels: data.levels.map((l) => Number(l.value)),
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
              disabled={!isDirty || !isValid || (blockOnWarning && Boolean(warning))}
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
              onClick={() => append({ value: 0 })}
            >
              Add Level
            </button>
          </div>
          {warning && (
            <span className={`${blockOnWarning ? 'text-red-500' : 'text-yellow-600'} block mb-3`}>
              {warning}
            </span>
          )}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 border rounded justify-items-center items-end gap-3 mb-3 p-3"
            >
              <LabeledInput
                id={`levels.${index}.value`}
                label={`Level ${index} ${levelLabel}`}
                type="number"
                allowFloats={false}
                allowNegativeValue
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
