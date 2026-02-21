import React from 'react';
import { FieldValues, Path, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import LabeledInput from './LabledInput';
import LabeledSelect from './LabledSelect';

import { DEFAULT_AUGMENT_EFFECT } from '../constants/augment';
import {
  AOE_AUGMENT_MODES,
  AOE_RADIUS_AUGMENT_MODES,
  AUGMENT_BUFF_TYPES,
  AUGMENT_DOMAINS,
  AUGMENT_RESOURCES,
  AUGMENT_STATS,
  AUGMENT_TYPES,
  AugmentType,
  MAX_TARGETS_AUGMENT_MODES,
  RANGE_AUGMENT_MODES,
} from '../types/augment';
import { createSelectOptions } from '../utils/createSelectOptions';

interface AugmentEffectFieldArrayProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
}

const AugmentEffectEntry = <T extends FieldValues>({
  prefix,
  index,
  onRemove,
}: {
  prefix: string;
  index: number;
  onRemove: () => void;
}) => {
  const { control } = useFormContext<T>();
  const augmentClass = useWatch({
    control,
    name: `${prefix}.${index}.augment_class` as Path<T>,
  }) as AugmentType;

  const classSpecificForm = React.useMemo(() => {
    switch (augmentClass) {
      case 'DOT':
        return (
          <div className="grid grid-cols-3 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledInput
              id={`${prefix}.${index}.dot_augment_props.flat_damage` as Path<T>}
              label="Flat Damage"
              type="number"
              allowFloats={false}
              allowNegativeValue
              required
            />
            <LabeledInput
              id={`${prefix}.${index}.dot_augment_props.phys_def_reduction_modifier` as Path<T>}
              label="Physical Defense Reduction Modifier"
              type="number"
              required
            />
            <LabeledInput
              id={`${prefix}.${index}.dot_augment_props.spec_def_reduction_modifier` as Path<T>}
              label="Special Defense Reduction Modifier"
              type="number"
              required
            />
            <LabeledSelect
              id={`${prefix}.${index}.dot_augment_props.resource` as Path<T>}
              label="Resource"
              options={createSelectOptions(AUGMENT_RESOURCES)}
            />
            <LabeledSelect
              id={`${prefix}.${index}.dot_augment_props.resolution_type` as Path<T>}
              label="Resolution Type"
              options={createSelectOptions(AUGMENT_DOMAINS)}
            />
          </div>
        );
      case 'FLAT_STAT':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.flat_stat_props.stat` as Path<T>}
              label="Stat"
              options={createSelectOptions(AUGMENT_STATS)}
            />
            <LabeledInput
              id={`${prefix}.${index}.flat_stat_props.amount` as Path<T>}
              label="Amount"
              type="number"
              allowFloats={false}
              allowNegativeValue
              required
            />
          </div>
        );
      case 'STAT_MULT':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.stat_mult_props.stat` as Path<T>}
              label="Stat"
              options={createSelectOptions(AUGMENT_STATS)}
            />
            <LabeledInput
              id={`${prefix}.${index}.stat_mult_props.multiplier` as Path<T>}
              label="Multiplier"
              type="number"
              required
            />
          </div>
        );
      case 'RANGE':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.range_augment_props.mode` as Path<T>}
              label="Mode"
              options={createSelectOptions(RANGE_AUGMENT_MODES)}
            />
            <LabeledInput
              id={`${prefix}.${index}.range_augment_props.amount` as Path<T>}
              label="Amount"
              type="number"
              allowNegativeValue
              required
            />
          </div>
        );
      case 'AOE':
        return (
          <div className="grid grid-cols-1 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.aoe_augment_props.mode` as Path<T>}
              label="Mode"
              options={createSelectOptions(AOE_AUGMENT_MODES)}
            />
          </div>
        );
      case 'AOE_RADIUS':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.aoe_radius_augment_props.mode` as Path<T>}
              label="Mode"
              options={createSelectOptions(AOE_RADIUS_AUGMENT_MODES)}
            />
            <LabeledInput
              id={`${prefix}.${index}.aoe_radius_augment_props.amount` as Path<T>}
              label="Amount"
              type="number"
              allowNegativeValue
              required
            />
          </div>
        );
      case 'MAX_TARGETS':
        return (
          <div className="grid grid-cols-2 justify-evenly border rounded justify-items-center gap-3 p-4">
            <LabeledSelect
              id={`${prefix}.${index}.max_targets_augment_props.mode` as Path<T>}
              label="Mode"
              options={createSelectOptions(MAX_TARGETS_AUGMENT_MODES)}
            />
            <LabeledInput
              id={`${prefix}.${index}.max_targets_augment_props.amount` as Path<T>}
              label="Amount"
              type="number"
              allowNegativeValue
              required
            />
          </div>
        );
      default:
        return null;
    }
  }, [augmentClass, prefix, index]);

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
          id={`${prefix}.${index}.augment_class` as Path<T>}
          label="Augment Class"
          options={createSelectOptions(AUGMENT_TYPES)}
        />
        <LabeledSelect
          id={`${prefix}.${index}.type` as Path<T>}
          label="Buff Type"
          options={createSelectOptions(AUGMENT_BUFF_TYPES)}
        />
      </div>
      {classSpecificForm}
    </div>
  );
};

const AugmentEffectFieldArray = <T extends FieldValues>({
  name,
  label,
}: AugmentEffectFieldArrayProps<T>) => {
  const { control } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div className="mb-6">
      <h3 className="font-bold text-lg mb-3">{label}</h3>
      {fields.map((field, index) => (
        <AugmentEffectEntry<T>
          key={field.id}
          prefix={name}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
      <button
        type="button"
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => append(DEFAULT_AUGMENT_EFFECT as never)}
      >
        Add {label.replace(/s$/, '')}
      </button>
    </div>
  );
};

export default AugmentEffectFieldArray;
