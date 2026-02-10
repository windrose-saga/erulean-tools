import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { useAugments } from '../../store/getters/augment';
import { useGameStore } from '../../store/useGameStore';
import {
  Augment,
  AUGMENT_BUFF_TYPES,
  AUGMENT_DOMAINS,
  AUGMENT_RESOURCES,
  AUGMENT_STATS,
  AUGMENT_TYPES,
} from '../../types/augment';
import { createSelectOptions } from '../../utils/createSelectOptions';
import LabeledInput from '../LabledInput';
import LabeledSelect from '../LabledSelect';

export const AugmentForm: React.FC<{ augment: Augment }> = ({ augment }) => {
  const augments = useAugments();
  const setAugment = useGameStore.use.setAugment();

  const navigate = useNavigate();

  const methods = useForm<Augment>({ defaultValues: augment, mode: 'onChange' });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const onSubmit: SubmitHandler<Augment> = (data) => {
    setAugment(data);
    navigate({ to: '/augments' });
  };

  const augmentType = watch('augment_class');
  const isUnique = watch('unique');
  const isDurational = watch('durational');
  const buttonText = isDirty ? 'Cancel' : 'Back';
  const initialId = augment.id;

  const validateId = React.useCallback(
    (id: string) => {
      if (augments.some((element: Augment) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [augments, initialId],
  );
  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: '/augments' });
  }, [isDirty, navigate, reset]);

  const augmentTypeForm = React.useMemo(() => {
    switch (augmentType) {
      case 'DOT':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput
              id="dot_augment_props.flat_damage"
              label="Flat Damage"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="dot_augment_props.phys_def_reduction_modifier"
              label="Physical Defense Reduction Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="dot_augment_props.spec_def_reduction_modifier"
              label="Special Defense Reduction Modifier"
              type="number"
              required
            />
            <LabeledSelect
              id="dot_augment_props.resource"
              label="Resource"
              options={createSelectOptions(AUGMENT_RESOURCES)}
            />
            <LabeledSelect
              id="dot_augment_props.resolution_type"
              label="Resolution Type"
              options={createSelectOptions(AUGMENT_DOMAINS)}
            />
          </div>
        );
      case 'FLAT_STAT':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledSelect
              id="flat_stat_props.stat"
              label="Stat"
              options={createSelectOptions(AUGMENT_STATS)}
            />
            <LabeledInput
              id="flat_stat_props.amount"
              label="Amount"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'STAT_MULT':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledSelect
              id="stat_mult_props.stat"
              label="Stat"
              options={createSelectOptions(AUGMENT_STATS)}
            />
            <LabeledInput
              id="stat_mult_props.multiplier"
              label="Multiplier"
              type="number"
              required
            />
          </div>
        );
      default:
        return null;
    }
  }, [augmentType]);

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
          <LabeledInput id="description" label="Description" type="text" required />
          <div className="flex justify-between">
            <div className="flex flex-col">
              <LabeledSelect
                id="type"
                label="Type"
                options={createSelectOptions(AUGMENT_BUFF_TYPES)}
              />
              <LabeledSelect
                id="augment_class"
                label="Augment Class"
                options={createSelectOptions(AUGMENT_TYPES)}
              />
            </div>
            <div className="flex flex-col gap-3 p-3">
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
        </div>

        <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput id="unique" label="Is Unique" type="checkbox" />
          <LabeledInput
            id="unique_indentifier"
            label="Unique Identifier"
            type="text"
            disabled={!isUnique}
            required={isUnique}
          />
          <LabeledInput
            id="replenishable"
            label="Is Replenishable"
            type="checkbox"
            disabled={!isUnique}
          />
        </div>
        <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput id="undispellable" label="Is Dispellable" type="checkbox" />
          <LabeledInput id="durational" label="Is Durational" type="checkbox" />
          <LabeledInput
            id="duration"
            label="Duration"
            type="number"
            allowFloats={false}
            disabled={!isDurational}
            required={isDurational}
          />
        </div>
        {augmentTypeForm}
      </form>
    </FormProvider>
  );
};
