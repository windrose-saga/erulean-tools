import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import { GeneratorClass } from '../../types/levelClass';
import { VOCAB_ID_PATTERN } from '../../utils/vocabId';
import LabeledInputBase, { LabeledInputProps } from '../LabledInput';

// Editor form shape: the stored parallel `jitter`/`rarity_pressure` number arrays are zipped
// into a single per-level row list so adding/removing a level affects both curves together,
// then split back into the two arrays on save.
type GeneratorFormShape = {
  guid: string;
  id: string;
  name: string;
  levels: Array<{ jitter: number; rarity_pressure: number }>;
};

const LabeledInput = (props: LabeledInputProps<GeneratorFormShape>) => (
  <LabeledInputBase<GeneratorFormShape> {...props} />
);

export interface GeneratorClassFormProps {
  generatorClass: GeneratorClass;
  others: GeneratorClass[];
  onSave: (generatorClass: GeneratorClass) => void;
  routeBase: string;
}

const toForm = (generatorClass: GeneratorClass): GeneratorFormShape => {
  const length = Math.max(generatorClass.jitter.length, generatorClass.rarity_pressure.length);
  return {
    guid: generatorClass.guid,
    id: generatorClass.id,
    name: generatorClass.name,
    levels: Array.from({ length }, (_, index) => ({
      jitter: generatorClass.jitter[index] ?? 0,
      rarity_pressure: generatorClass.rarity_pressure[index] ?? 0,
    })),
  };
};

export const GeneratorClassForm: React.FC<GeneratorClassFormProps> = ({
  generatorClass,
  others,
  onSave,
  routeBase,
}) => {
  const navigate = useNavigate();
  const methods = useForm<GeneratorFormShape>({
    defaultValues: toForm(generatorClass),
    mode: 'onChange',
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'levels' });

  const initialId = generatorClass.id;
  const validateId = React.useCallback(
    (id: string) => {
      if (others.some((element) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [others, initialId],
  );

  const onSubmit: SubmitHandler<GeneratorFormShape> = (data) => {
    onSave({
      guid: generatorClass.guid,
      id: data.id,
      name: data.name,
      jitter: data.levels.map((level) => Number(level.jitter)),
      rarity_pressure: data.levels.map((level) => Number(level.rarity_pressure)),
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
              onClick={() => append({ jitter: 0, rarity_pressure: 0 })}
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
                id={`levels.${index}.jitter`}
                label={`Level ${index} Jitter`}
                type="number"
                allowNegativeValue
                required
              />
              <LabeledInput
                id={`levels.${index}.rarity_pressure`}
                label={`Level ${index} Rarity Pressure`}
                type="number"
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
