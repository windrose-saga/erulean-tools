import * as React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';

import LabeledInputBase, { LabeledInputProps } from './LabledInput';
import LabeledSelect from './LabledSelect';

import { useUnit } from '../store/getters/unit';
import { Unit } from '../types/unit';

type UnitInputs = Unit;

const LabeledInput = (props: LabeledInputProps<Unit>) => <LabeledInputBase<Unit> {...props} />;

// temp constant for now
const MOVEMENT_STRATEGIES = [
  {
    name: 'Advance',
    value: 'ADVANCE',
  },
  {
    name: 'Keep Distance',
    value: 'KEEP_DISTANCE',
  },
];

export const UnitDetail: React.FC<{ unitId: string }> = ({ unitId }) => {
  const unit = useUnit(unitId);

  const methods = useForm<UnitInputs>({ defaultValues: unit });
  const { handleSubmit, watch } = methods;
  // eslint-disable-next-line no-console
  const onSubmit: SubmitHandler<UnitInputs> = (data) => console.log(data);
  const isCurrentlyCommander = watch('is_commander');
  return (
    <>
      <p className="font-bold text-2xl">{unit.name}</p>
      <p className="font-bold">{unit.description}</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="justify-items-center mb-3">
            <LabeledInput id="point_value" label="Point Value" type="number" allowFloats={false} />
          </div>
          <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput id="max_hp" label="Max HP" type="number" allowFloats={false} />
            <LabeledInput id="max_mana" label="Max Mana" type="number" allowFloats={false} />
            <LabeledInput id="mana_growth" label="Mana Growth" type="number" allowFloats={false} />
            <LabeledInput id="starting_hp" label="Starting HP" type="number" allowFloats={false} />
            <LabeledInput
              id="starting_mana"
              label="Starting Mana"
              type="number"
              allowFloats={false}
            />
          </div>
          <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput
              id="phys_defense"
              label="Physical Defense"
              type="number"
              allowFloats={false}
            />
            <LabeledInput id="speed" label="Speed" type="number" allowFloats={false} />
            <LabeledInput id="strength" label="Strength" type="number" allowFloats={false} />
            <LabeledInput
              id="spec_defense"
              label="Special Defense"
              type="number"
              allowFloats={false}
            />
            <LabeledInput
              id="intelligence"
              label="Intelligence"
              type="number"
              allowFloats={false}
            />
            <LabeledInput id="luck" label="Luck" type="number" allowFloats={false} />
            <LabeledInput id="bravery" label="Bravery" type="number" allowFloats={false} />
          </div>
          <div className="flex justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput id="is_commander" label="Is Commander" type="checkbox" />
            <LabeledInput id="faithful" label="Is Faithful" type="checkbox" />
            <LabeledInput id="can_flee" label="Can Flee" type="checkbox" />
            <LabeledInput
              id="inaction_limit"
              label="Inaction Limit"
              type="number"
              allowFloats={false}
            />
          </div>
          {isCurrentlyCommander && (
            <div className="grid grid-cols-3 border rounded justify-items-center gap-3 mb-6 p-6">
              <LabeledInput
                id="commander_data.leadership"
                label="Leadership"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.point_limit"
                label="Point Limit"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.grid_size_x"
                label="Grid Size X"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.grid_size_y"
                label="Grid Size Y"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.global_augments"
                label="Global Augments"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.army_name"
                label="Army Augments"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="commander_data.enemy_army_augments"
                label="Enemy Army Augments"
                type="number"
                allowFloats={false}
              />
              <LabeledInput id="commander_data.army_name" label="Army Name" type="text" />
            </div>
          )}
          <div className="flex justify-evenly border rounded gap-3 mb-6 p-6">
            <LabeledInput id="movement" label="Movement" type="number" allowFloats={false} />
            <LabeledInput
              id="holding_distance"
              label="Holding Distance"
              type="number"
              allowFloats={false}
            />
            <LabeledSelect
              id="movement_strategy"
              label="Movement Strategy"
              options={MOVEMENT_STRATEGIES}
            />
          </div>
          <input
            className="bg-gray-500 active:bg-gray-600 border-white rounded p-3"
            type="submit"
          />
        </form>
      </FormProvider>
    </>
  );
};
