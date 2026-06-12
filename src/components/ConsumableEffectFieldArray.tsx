import React from 'react';
import { FieldValues, Path, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import ArraySelect from './ArraySelect';
import LabeledInput from './LabledInput';
import LabeledSelect from './LabledSelect';

import { DEFAULT_CONSUMABLE_EFFECT } from '../constants/item';
import {
  CONSUMABLE_EFFECT_CLASS_DOMAINS,
  CONSUMABLE_EFFECT_CLASSES,
  ConsumableEffectClass,
  ConsumableEffectDomain,
  HEAL_MODES,
  isDurationalEffectClass,
} from '../types/item';
import { createSelectOptions } from '../utils/createSelectOptions';

interface ConsumableEffectFieldArrayProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
}

// createSelectOptions only replaces the first underscore; effect classes have several, so
// build readable labels here (e.g. NEXT_BATTLE_AUGMENTS -> "Next Battle Augments").
const prettifyClass = (value: string): string =>
  value
    .split('_')
    .map((word: string) => word[0].toUpperCase() + word.substring(1).toLowerCase())
    .join(' ');

// Group the effect select by domain (matches the spec's Worldmap / Dungeon / Agnostic
// split) so the dropdown shows non-selectable headers between groups.
const DOMAIN_GROUP_LABELS: Record<ConsumableEffectDomain, string> = {
  WORLDMAP: 'Worldmap',
  DUNGEON: 'Dungeon',
  GLOBAL: 'Agnostic (Worldmap or Dungeon)',
};
const DOMAIN_GROUP_ORDER: Array<ConsumableEffectDomain> = ['WORLDMAP', 'DUNGEON', 'GLOBAL'];

const EFFECT_CLASS_GROUPS = DOMAIN_GROUP_ORDER.map((domain) => ({
  label: DOMAIN_GROUP_LABELS[domain],
  options: CONSUMABLE_EFFECT_CLASSES.filter(
    (value) => CONSUMABLE_EFFECT_CLASS_DOMAINS[value] === domain,
  ).map((value) => ({ name: prettifyClass(value), value })),
}));

const ConsumableEffectEntry = <T extends FieldValues>({
  prefix,
  index,
  onRemove,
}: {
  prefix: string;
  index: number;
  onRemove: () => void;
}) => {
  const { control } = useFormContext<T>();
  const effectClass = useWatch({
    control,
    name: `${prefix}.${index}.effect_class` as Path<T>,
  }) as ConsumableEffectClass;

  // NEXT_BATTLE_AUGMENTS is durational but on the NEXT_BATTLE clock, which ignores duration.
  const showDuration =
    isDurationalEffectClass(effectClass) && effectClass !== 'NEXT_BATTLE_AUGMENTS';

  const classSpecificForm = React.useMemo(() => {
    switch (effectClass) {
      case 'GRANT_MOVEMENT':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.grant_movement_props.moves` as Path<T>}
              label="Moves"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'GRANT_ACTION':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.grant_action_props.actions` as Path<T>}
              label="Actions"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'REDUCE_ARMY_AGGRO':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.reduce_army_aggro_props.reduction` as Path<T>}
              label="Reduction"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'RESTORE_PARTY_HEALTH':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.restore_party_health_props.mode` as Path<T>}
              label="Mode"
              options={createSelectOptions(HEAL_MODES)}
            />
            <LabeledInput
              id={`${prefix}.${index}.restore_party_health_props.amount` as Path<T>}
              label="Amount"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'EXPAND_VISION':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.expand_vision_props.bonus_radius` as Path<T>}
              label="Bonus Radius"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'REDUCE_ENEMY_VISION':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.reduce_enemy_vision_props.reduction` as Path<T>}
              label="Reduction"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'SPAWN_ENEMIES':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.spawn_enemies_props.count` as Path<T>}
              label="Count"
              type="number"
              allowFloats={false}
              required
            />
          </div>
        );
      case 'NEXT_BATTLE_AUGMENTS':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 p-4">
            <ArraySelect<T>
              id={`${prefix}.${index}.next_battle_augments_props.player_army_augments` as Path<T>}
              label="Player Army Augments"
              type="AUGMENT"
            />
            <ArraySelect<T>
              id={`${prefix}.${index}.next_battle_augments_props.enemy_army_augments` as Path<T>}
              label="Enemy Army Augments"
              type="AUGMENT"
            />
            <ArraySelect<T>
              id={`${prefix}.${index}.next_battle_augments_props.global_augments` as Path<T>}
              label="Global Augments"
              type="AUGMENT"
            />
          </div>
        );
      case 'BOOST_DROP_RATE':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.boost_drop_rate_props.multiplier` as Path<T>}
              label="Multiplier"
              type="number"
              required
            />
            <LabeledInput
              id={`${prefix}.${index}.boost_drop_rate_props.rarity_pressure_multiplier` as Path<T>}
              label="Rarity Pressure Multiplier"
              type="number"
              required
            />
          </div>
        );
      case 'BOOST_EXP_RATE':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.boost_exp_rate_props.multiplier` as Path<T>}
              label="Multiplier"
              type="number"
              required
            />
          </div>
        );
      case 'REDUCE_MORTALITY':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.reduce_mortality_props.multiplier` as Path<T>}
              label="Multiplier"
              type="number"
              required
            />
          </div>
        );
      // Propless effects: WARP_TO_RESPAWN, REVEAL_FLOOR, MARK_CHESTS, MARK_ENEMIES,
      // FREEZE_ENEMIES, DISABLE_ENEMY_AGGRO, ESCAPE_ROPE, UNLOCK_DOORS, EXTRA_FLOOR,
      // REDRAW_FLOOR. (Durational propless ones still show the duration input below.)
      default:
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <p className="text-sm text-gray-500">No additional properties for this effect</p>
          </div>
        );
    }
  }, [effectClass, prefix, index]);

  return (
    <div className="border rounded p-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold">Effect {index + 1}</span>
        <button
          type="button"
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-2 justify-evenly justify-items-center gap-3 mb-3">
        <LabeledSelect
          id={`${prefix}.${index}.effect_class` as Path<T>}
          label="Effect Class"
          groups={EFFECT_CLASS_GROUPS}
        />
        {showDuration && (
          <LabeledInput
            id={`${prefix}.${index}.duration` as Path<T>}
            label="Duration"
            type="number"
            allowFloats={false}
            required
          />
        )}
      </div>
      {classSpecificForm}
    </div>
  );
};

const ConsumableEffectFieldArray = <T extends FieldValues>({
  name,
  label,
}: ConsumableEffectFieldArrayProps<T>) => {
  const { control } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="mb-6">
      <h3 className="font-bold text-lg mb-3">{label}</h3>
      {fields.map((field, index) => (
        <ConsumableEffectEntry<T>
          key={field.id}
          prefix={name}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
      <button
        type="button"
        className="bg-blue-500 text-white px-3 py-1 rounded"
        // save_key is auto-generated per entry and never surfaced; a stable UUID keeps an
        // effect's active-effect save identity intact across reordering.
        onClick={() =>
          append({ ...DEFAULT_CONSUMABLE_EFFECT, save_key: crypto.randomUUID() } as never)
        }
      >
        Add {label.replace(/s$/, '')}
      </button>
    </div>
  );
};

export default ConsumableEffectFieldArray;
