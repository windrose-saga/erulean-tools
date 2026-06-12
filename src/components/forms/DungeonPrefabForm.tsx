import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { usePrefabs } from '../../store/getters/prefab';
import { useGameStore } from '../../store/useGameStore';
import { DungeonPrefab } from '../../types/dungeonPrefab';
import { DungeonPrefabLayoutEditor } from '../DungeonPrefabLayoutEditor';
import LabeledInput from '../LabledInput';

export const DungeonPrefabForm: React.FC<{ prefab: DungeonPrefab }> = ({ prefab }) => {
  const prefabs = usePrefabs();
  const setPrefab = useGameStore.use.setPrefab();

  const navigate = useNavigate();

  const methods = useForm<DungeonPrefab>({ defaultValues: prefab, mode: 'onChange' });
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const onSubmit: SubmitHandler<DungeonPrefab> = (data) => {
    setPrefab(data);
    navigate({ to: '/prefabs' });
  };

  const buttonText = isDirty ? 'Cancel' : 'Back';
  const initialId = prefab.id;

  const validateId = React.useCallback(
    (id: string) => {
      if (prefabs.some((element: DungeonPrefab) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [prefabs, initialId],
  );

  const validateLayout = React.useCallback((layout: string) => {
    if (!/[.*]/.test(layout)) {
      return "Layout needs at least one floor cell ('.' or '*')";
    }
    if (!layout.includes('*')) {
      return "Layout needs at least one entrance ('*')";
    }
    return true;
  }, []);

  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: '/prefabs' });
  }, [isDirty, navigate, reset]);

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
              value: /^[A-Z0-9]+$/,
              message: 'ID must be all caps and letters only, and contain no spaces or symbols.',
            }}
            required
          />
          <LabeledInput id="name" label="Name" type="text" required />

          <Controller
            control={control}
            name="layout"
            rules={{ validate: validateLayout }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <span className="font-bold text-left">Layout</span>
                <p className="text-sm text-gray-500"># wall, . floor, * entrance</p>
                <DungeonPrefabLayoutEditor value={field.value} onChange={field.onChange} />
                {fieldState.error && (
                  <span className="text-red-500">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-3 p-3">
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
      </form>
    </FormProvider>
  );
};
