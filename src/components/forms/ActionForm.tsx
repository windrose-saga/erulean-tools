import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { useActions } from '../../store/getters/action';
import { useGameStore } from '../../store/useGameStore';
import {
  Action,
  ACTION_TYPES,
  APPROACH_STRATEGIES,
  DISPEL_ACTION_MODES,
  TARGETING_TYPES,
} from '../../types/action';
import { AUGMENT_BUFF_TYPES, AUGMENT_DOMAINS, AUGMENT_TARGETS } from '../../types/augment';
import { createSelectOptions } from '../../utils/createSelectOptions';
import ArraySelect from '../ArraySelect';
import FormAugmentSelect from '../FormAugmentSelect';
import LabeledInput from '../LabledInput';
import LabeledSelect from '../LabledSelect';

export const ActionForm: React.FC<{ action: Action }> = ({ action }) => {
  const actions = useActions();
  const setAction = useGameStore.use.setAction();

  const navigate = useNavigate();

  const methods = useForm<Action>({ defaultValues: action, mode: 'onChange' });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const onSubmit: SubmitHandler<Action> = (data) => {
    setAction(data);
    navigate({ to: '/actions' });
  };

  const actionType = watch('action_type');
  const buttonText = isDirty ? 'Cancel' : 'Back';
  const initialId = action.id;

  const validateId = React.useCallback(
    (id: string) => {
      if (actions.some((element: Action) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [actions, initialId],
  );
  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: '/actions' });
  }, [isDirty, navigate, reset]);

  const actionTypeForm = React.useMemo(() => {
    switch (actionType) {
      case 'DAMAGE_ACTION':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput
              id="damage_action_props.base_phys_damage"
              label="Base Physical Damage"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="damage_action_props.unit_strength_modifier"
              label="Unit Strength Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.target_phys_defense_modifier"
              label="Target Physical Defense Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.base_magic_damage"
              label="Base Magic Damage"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="damage_action_props.unit_int_modifier"
              label="Unit Intelligence Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.target_spec_defense_modifier"
              label="Target Special Defense Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.base_dex_damage"
              label="Base Dexterity Damage"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="damage_action_props.unit_speed_modifier"
              label="Unit Speed Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.target_speed_modifier"
              label="Target Speed Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.crit_modifier"
              label="Crit Modifier"
              type="number"
              required
            />
            <LabeledInput
              id="damage_action_props.base_damage"
              label="Base Damage"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="damage_action_props.target_augment_self"
              label="Target Augment Self"
              type="checkbox"
            />
            <LabeledInput
              id="damage_action_props.total_damage_multiplier"
              label="Total Damage Multiplier"
              type="number"
              required
            />
            <FormAugmentSelect id="damage_action_props.augment" label="Augment" />
            <FormAugmentSelect id="damage_action_props.crit_augment" label="Crit Augment" />
          </div>
        );
      case 'HEAL':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput
              id="heal_props.hp"
              label="HP"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="heal_props.decay"
              label="Decay"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="heal_props.should_target_full_hp"
              label="Should Target Full HP"
              type="checkbox"
            />
          </div>
        );
      case 'MANA_ACTION':
        return (
          <div className="grid grid-cols-4 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledInput
              id="mana_action_props.should_target_enemy"
              label="Should Target Enemy"
              type="checkbox"
            />
            <LabeledInput
              id="mana_action_props.mana_amount"
              label="Mana Amount"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="mana_action_props.should_target_full_mp"
              label="Should Target Full MP"
              type="checkbox"
            />
            <FormAugmentSelect id="mana_action_props.tag_augment" label="Tag Augment" />
          </div>
        );
      case 'AUGMENT_ACTION':
        return (
          <div className="grid grid-cols-4 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <ArraySelect id="augment_action_props.augments" label="Augments" type="AUGMENT" />
            <ArraySelect
              id="augment_action_props.crit_augments"
              label="Crit Augments"
              type="AUGMENT"
            />
            <LabeledInput
              id="augment_action_props.should_reapply"
              label="Should Reapply"
              type="checkbox"
            />
            <LabeledInput
              id="augment_action_props.should_target_enemy"
              label="Should Target Enemy"
              type="checkbox"
            />
          </div>
        );
      case 'DISPEL_ACTION':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <LabeledSelect
              id="dispel_action_props.mode"
              label="Mode"
              options={createSelectOptions(DISPEL_ACTION_MODES)}
            />
            <LabeledSelect
              id="dispel_action_props.domain"
              label="Domain"
              options={createSelectOptions(AUGMENT_DOMAINS)}
            />
            <LabeledSelect
              id="dispel_action_props.target"
              label="Target"
              options={createSelectOptions(AUGMENT_TARGETS)}
            />
            <LabeledInput
              id="dispel_action_props.augment_name"
              label="Augment Name"
              type="text"
              required
            />
            <LabeledInput
              id="dispel_action_props.unique_identifier"
              label="Unique Identifier"
              type="text"
              required
            />
            <LabeledSelect
              id="dispel_action_props.type"
              label="Type"
              options={createSelectOptions(AUGMENT_BUFF_TYPES)}
            />
            <LabeledInput
              id="dispel_action_props.force_dispel"
              label="Force Dispel"
              type="checkbox"
            />
            <LabeledInput
              id="dispel_action_props.force_on_crit"
              label="Force on Crit"
              type="checkbox"
            />
            <LabeledInput
              id="dispel_action_props.should_target_enemy"
              label="Should Target Enemy"
              type="checkbox"
            />
            <LabeledInput
              id="dispel_action_props.only_target_augmented_units"
              label="Only Target Augmented Units"
              type="checkbox"
            />
            <LabeledInput
              id="dispel_action_props.ignore_target_allegiance"
              label="Ignore Target Allegiance"
              type="checkbox"
            />
          </div>
        );
      case 'TAG_ACTION':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <FormAugmentSelect id="tag_action_props.tag_augment" label="Tag Augment" />
            <LabeledInput
              id="tag_action_props.should_target_enemy"
              label="Should Target Enemy"
              type="checkbox"
            />
            <LabeledInput
              id="tag_action_props.follow_tagged_unit"
              label="Follow Tagged Unit"
              type="checkbox"
            />
          </div>
        );
      case 'SUMMON_ACTION':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <ArraySelect id="summon_action_props.summons" label="Summons" type="UNIT" />
            <LabeledInput
              id="summon_action_props.should_target_enemy"
              label="Should Target Enemy"
              type="checkbox"
            />
            <FormAugmentSelect id="summon_action_props.summon_augment" label="Summon Augment" />
            <LabeledInput
              id="summon_action_props.summoning_range"
              label="Summoning Range"
              type="number"
              allowFloats={false}
              required
            />
            <LabeledInput
              id="summon_action_props.should_summon_impact_morale"
              label="Should Summon Impact Morale"
              type="checkbox"
            />
          </div>
        );
      default:
        return <p>Encountered a problem. Not a valid Action Type.</p>;
    }
  }, [actionType]);

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
                id="action_type"
                label="Action Type"
                options={createSelectOptions(ACTION_TYPES)}
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

        <div className="grid grid-cols-2 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledSelect
            id="targeting_type"
            label="Targeting Type"
            options={createSelectOptions(TARGETING_TYPES)}
          />
          <LabeledSelect
            id="approach_strategy"
            label="Approach Strategy"
            options={createSelectOptions(APPROACH_STRATEGIES)}
          />
          <LabeledInput
            id="targeting_range"
            label="Targeting Range"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput id="break_vanguard" label="Break Vanguard" type="checkbox" />
          <LabeledInput
            id="max_targets"
            label="Max Targets"
            type="number"
            allowFloats={false}
            required
          />
          <LabeledInput id="chain" label="Chain" type="checkbox" />
          <LabeledInput id="target_self" label="Target Self" type="checkbox" />
          <LabeledInput id="splash" label="Splash" type="number" allowFloats={false} required />
          <LabeledInput
            id="max_chain_depth"
            label="Max Chain Depth"
            type="number"
            allowFloats={false}
            required
          />
        </div>

        <div className="grid grid-cols-2 border rounded justify-items-center gap-3 mb-6 p-6">
          <LabeledInput id="should_check_evasion" label="Should Check Evasion" type="checkbox" />
          <LabeledInput id="can_crit" label="Can Crit" type="checkbox" />
          <LabeledInput id="evasion_multiplier" label="Evasion Multiplier" type="number" required />
          <LabeledInput
            id="crit_chance_multiplier"
            label="Crit Chance Multiplier"
            type="number"
            required
          />
        </div>
        <div className="flex justify-evenly border rounded gap-3 mb-6 p-6">
          <LabeledInput id="delay" label="Delay" type="number" required />
        </div>
        {actionTypeForm}
      </form>
    </FormProvider>
  );
};
