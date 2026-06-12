import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { useItems } from '../../store/getters/item';
import { useGameStore } from '../../store/useGameStore';
import {
  CONSUMABLE_EFFECT_CLASS_DOMAINS,
  ConsumableEffect,
  Item,
  ITEM_TYPES,
} from '../../types/item';
import { createSelectOptions } from '../../utils/createSelectOptions';
import ArraySelect from '../ArraySelect';
import AugmentEffectFieldArray from '../AugmentEffectFieldArray';
import ConsumableEffectFieldArray from '../ConsumableEffectFieldArray';
import LabeledInput from '../LabledInput';
import LabeledSelect from '../LabledSelect';
import LootCategoryMultiSelect from '../LootCategoryMultiSelect';
import RoleMultiSelect from '../RoleMultiSelect';

export const ItemForm: React.FC<{ item: Item }> = ({ item }) => {
  const items = useItems();
  const setItem = useGameStore.use.setItem();

  const navigate = useNavigate();

  const methods = useForm<Item>({ defaultValues: item, mode: 'onChange' });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const onSubmit: SubmitHandler<Item> = (data) => {
    setItem(data);
    navigate({ to: '/items' });
  };

  const itemType = watch('item_type');
  const isDurational = watch('equipment_props.shared_augment_data.durational');
  const consumableEffects = watch('consumable_props.effects');
  const buttonText = isDirty ? 'Cancel' : 'Back';
  const initialId = item.id;

  // Mirror Consumable.is_domain_valid(): a consumable needs at least one effect and may not
  // mix DUNGEON and WORLDMAP effects. Blocks Save so unusable data never reaches game-data.json.
  const consumableDomainError = React.useMemo<string | null>(() => {
    if (itemType !== 'CONSUMABLE') return null;
    const effects: Array<ConsumableEffect> = consumableEffects ?? [];
    if (effects.length === 0) return 'A consumable must have at least one effect.';
    const domains = new Set(
      effects.map((effect) => CONSUMABLE_EFFECT_CLASS_DOMAINS[effect.effect_class]),
    );
    if (domains.has('DUNGEON') && domains.has('WORLDMAP')) {
      return 'A consumable cannot mix DUNGEON and WORLDMAP effects.';
    }
    return null;
  }, [itemType, consumableEffects]);

  const validateId = React.useCallback(
    (id: string) => {
      if (items.some((element: Item) => element.id === id && id !== initialId)) {
        return 'This ID is already in use';
      }
      return true;
    },
    [items, initialId],
  );
  const onButtonPress = React.useCallback(() => {
    if (isDirty) reset();
    else navigate({ to: '/items' });
  }, [isDirty, navigate, reset]);

  const itemTypeForm = React.useMemo(() => {
    switch (itemType) {
      case 'EQUIPMENT':
        return (
          <>
            <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
              <ArraySelect id="equipment_props.effects" label="Effects" type="AUGMENT" />
              <LabeledInput id="equipment_props.everlasting" label="Everlasting" type="checkbox" />
            </div>
            <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
              <LabeledInput
                id="equipment_props.slot"
                label="Slot"
                type="number"
                allowFloats={false}
              />
              <LabeledInput
                id="equipment_props.quality"
                label="Quality"
                type="number"
                allowFloats={false}
              />
              <RoleMultiSelect<Item> id="equipment_props.for_role" label="For Role" />
            </div>
            <h3 className="font-bold text-lg mb-3">Shared Augment Data</h3>
            <div className="grid grid-cols-4 border rounded justify-items-center gap-3 mb-6 p-6">
              <LabeledInput
                id="equipment_props.shared_augment_data.undispellable"
                label="Undispellable"
                type="checkbox"
              />
              <LabeledInput
                id="equipment_props.shared_augment_data.replenishable"
                label="Replenishable"
                type="checkbox"
              />
              <LabeledInput
                id="equipment_props.shared_augment_data.durational"
                label="Durational"
                type="checkbox"
              />
              <LabeledInput
                id="equipment_props.shared_augment_data.duration"
                label="Duration"
                type="number"
                allowFloats={false}
                disabled={!isDurational}
                required={isDurational}
              />
            </div>
            <div className="border rounded gap-3 mb-6 p-6">
              <AugmentEffectFieldArray<Item>
                name="equipment_props.augment_effects"
                label="Augment Effects"
              />
            </div>
          </>
        );
      case 'CONSUMABLE':
        return (
          <>
            <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
              <LabeledInput
                id="consumable_props.consumed_on_use"
                label="Consumed On Use"
                type="checkbox"
              />
            </div>
            {consumableDomainError && (
              <p className="text-red-500 mb-3">{consumableDomainError}</p>
            )}
            <div className="border rounded gap-3 mb-6 p-6">
              <ConsumableEffectFieldArray<Item> name="consumable_props.effects" label="Effects" />
            </div>
          </>
        );
      case 'ITEM':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 mb-6 p-6">
            <p className="text-sm text-gray-500">No additional properties for basic items</p>
          </div>
        );
      default:
        return <p>Encountered a problem. Not a valid Item Type.</p>;
    }
  }, [itemType, isDurational, consumableDomainError]);

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
          <LabeledInput id="gold_value" label="Gold Value" type="number" allowFloats={false} />
          <LabeledInput id="sellable" label="Sellable" type="checkbox" />
          <LabeledInput id="rarity" label="Rarity" type="number" />
          <LootCategoryMultiSelect<Item> id="loot_categories" label="Loot Categories" />
          <div className="flex justify-between">
            <div className="flex flex-col">
              <LabeledSelect
                id="item_type"
                label="Item Type"
                options={createSelectOptions(ITEM_TYPES)}
              />
            </div>
            <div className="flex flex-col gap-3 p-3">
              <button
                className="bg-gray-500 active:bg-gray-600 disabled:bg-gray-300 border-white rounded p-3 w-36"
                type="submit"
                disabled={!isDirty || !isValid || !!consumableDomainError}
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

        {itemTypeForm}
      </form>
    </FormProvider>
  );
};
