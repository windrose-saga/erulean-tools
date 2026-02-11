import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';

import { useUnits } from '../../store/getters/unit';
import { useGameStore } from '../../store/useGameStore';
import { MOVEMENT_STRATEGIES, Unit } from '../../types/unit';
import { createSelectOptions } from '../../utils/createSelectOptions';
import ArraySelect from '../ArraySelect';
import FormActionSelect from '../FormActionSelect';
import LabeledInputBase, { LabeledInputProps } from '../LabledInput';
import LabeledSelect from '../LabledSelect';
import QuantitySelect from '../QuantitySelect';

type UnitInputs = Unit;

const LabeledInput = (props: LabeledInputProps<Unit>) => <LabeledInputBase<Unit> {...props} />;

export const UnitForm: React.FC<{ unit: Unit }> = ({ unit }) => {
  const units = useUnits();
  const setUnit = useGameStore.use.setUnit();

  const navigate = useNavigate();

  const methods = useForm<UnitInputs>({ defaultValues: unit, mode: 'onChange' });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const onSubmit: SubmitHandler<UnitInputs> = (data) => {
    setUnit(data);
    navigate({ to: '/units' });
  };
  const isCurrentlyCommander = watch('is_commander');
  const isCurrentlyTrainable = watch('trainable');
  const buttonText = isDirty ? 'Cancel' : 'Back';
  const initialId = unit.id;

  const validateId = React.useCallback(
    (id: string) => {
      if (units.some((element: Unit) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [units, initialId],
  );
  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: '/units' });
  }, [isDirty, navigate, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 mb-6 p-6">
          <LabeledInput
            id="id"
            label="ID"
            type="text"
            pattern={{
              value: /^[A-Z0-9]+$/,
              message: 'ID must be all caps and letters only, and contain no spaces or symbols.',
            }}
            validate={validateId}
            required
          />
          <LabeledInput id="name" label="Name" type="text" required />
          <LabeledInput id="description" label="Description" type="text" required />
          <div className="flex justify-between">
            <div className="flex flex-col">
              <LabeledInput
                id="point_value"
                label="Point Value"
                type="number"
                allowFloats={false}
                required
              />
              <LabeledInput
                id="exp_value"
                label="Exp Value"
                type="number"
                allowFloats={false}
                required
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
          <LabeledInput id="max_hp" label="Max HP" type="number" allowFloats={false} required />
          <LabeledInput id="max_mana" label="Max Mana" type="number" allowFloats={false} required />
          <LabeledInput
            id="mana_growth"
            label="Mana Growth"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput
            id="starting_hp"
            label="Starting HP"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput
            id="starting_mana"
            label="Starting Mana"
            type="number"
            allowFloats={false}
            required
          />
        </div>
        <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput
            id="phys_defense"
            label="Physical Defense"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput id="speed" label="Speed" type="number" allowFloats={false} required />
          <LabeledInput id="strength" label="Strength" type="number" allowFloats={false} required />
          <LabeledInput
            id="spec_defense"
            label="Special Defense"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput
            id="intelligence"
            label="Intelligence"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput id="luck" label="Luck" type="number" allowFloats={false} required />
          <LabeledInput id="bravery" label="Bravery" type="number" allowFloats={false} required />
        </div>
        <div className="flex justify-evenly border rounded gap-3 mb-6 p-6">
          <LabeledInput id="movement" label="Movement" type="number" allowFloats={false} required />
          <LabeledInput
            id="holding_distance"
            label="Holding Distance"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledSelect
            id="movement_strategy"
            label="Movement Strategy"
            options={createSelectOptions(MOVEMENT_STRATEGIES)}
          />
        </div>
        <div className="grid grid-cols-2 border rounded justify-items-center gap-3 mb-6 p-6">
          <FormActionSelect label="Primary" id="actions.primary_action" />
          <FormActionSelect label="Special" id="actions.special_action" />
        </div>
        <div className="grid grid-cols-2 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput
            id="actions.primary_action_mana_delta"
            label="Primary Action Mana Delta"
            type="number"
            allowFloats={false}
            allowNegativeValue
            required
          />
          <LabeledInput
            id="actions.special_action_mana_delta"
            label="Special Action Mana Delta"
            type="number"
            allowFloats={false}
            allowNegativeValue
            required
          />
        </div>
        <div className="flex justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput id="is_commander" label="Is Commander" type="checkbox" />
          <LabeledInput id="faithful" label="Is Faithful" type="checkbox" />
          <LabeledInput id="can_flee" label="Can Flee" type="checkbox" />
          <LabeledInput id="trainable" label="Trainable" type="checkbox" />
          <LabeledInput
            id="inaction_limit"
            label="Inaction Limit"
            type="number"
            allowFloats={false}
          />
        </div>
        {isCurrentlyCommander && (
          <>
            <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
              <LabeledInput
                id="commander_data.leadership"
                label="Leadership"
                type="number"
                allowFloats={false}
                required={isCurrentlyCommander}
              />
              <LabeledInput
                id="commander_data.point_limit"
                label="Point Limit"
                type="number"
                allowFloats={false}
                required={isCurrentlyCommander}
              />
              <LabeledInput
                id="commander_data.grid_size_x"
                label="Grid Size X"
                type="number"
                allowFloats={false}
                required={isCurrentlyCommander}
              />
              <LabeledInput
                id="commander_data.grid_size_y"
                label="Grid Size Y"
                type="number"
                allowFloats={false}
                required={isCurrentlyCommander}
              />
              <LabeledInput
                id="commander_data.army_name"
                label="Army Name"
                type="text"
                required={isCurrentlyCommander}
              />
            </div>
            <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
              <ArraySelect
                type="AUGMENT"
                label="Global Augments"
                id="commander_data.global_augments"
              />
              <ArraySelect type="AUGMENT" label="Army Augments" id="commander_data.army_augments" />
              <ArraySelect
                type="AUGMENT"
                label="Enemy Army Augments"
                id="commander_data.enemy_army_augments"
              />
            </div>
          </>
        )}
        <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput
            id="item_slots"
            label="Item Slots"
            type="number"
            allowFloats={false}
            required
          />
          <QuantitySelect id="reward_for_defeat" label="Reward for Defeat" type="ITEM" />
          <QuantitySelect id="returned_on_death" label="Returned on Death" type="ITEM" />
        </div>
        {isCurrentlyTrainable && (
          <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
            <QuantitySelect id="unit_cost" label="Unit Cost" type="UNIT" />
            <QuantitySelect id="item_cost" label="Item Cost" type="ITEM" />
            <LabeledInput
              id="required_level"
              label="Required Level"
              type="number"
              allowFloats={false}
              required={isCurrentlyTrainable}
            />
            <LabeledInput
              id="gold_cost"
              label="Gold Cost"
              type="number"
              allowFloats={false}
              required={isCurrentlyTrainable}
            />
            <LabeledInput
              id="train_button_text"
              label="Train Button Text"
              type="text"
              required={isCurrentlyTrainable}
            />
          </div>
        )}
      </form>
    </FormProvider>
  );
};
