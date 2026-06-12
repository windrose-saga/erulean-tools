import * as React from 'react'
import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface SelectOption {
  name: string;
  value: string;
}

export interface SelectOptionGroup {
  label: string;
  options: Array<SelectOption>;
}

export interface LabeledSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  options?: Array<SelectOption>;
  // When provided, options render as <optgroup>s with non-selectable group headers.
  groups?: Array<SelectOptionGroup>;
  treatEmptyAsNull?: boolean;
}

const renderOptions = (options: Array<SelectOption>) =>
  options.map(({ name, value }) => (
    <option key={value} value={value}>
      {name}
    </option>
  ));

const LabeledSelect = <T extends FieldValues>({
  label,
  id,
  options = [],
  groups,
  treatEmptyAsNull = true,
}: LabeledSelectProps<T>) => {
  const { register } = useFormContext<T>();

  const setValueAs = React.useCallback(
    (value: string) => {
      if (value === '' && treatEmptyAsNull) {
        return null;
      }
      return value;
    },
    [treatEmptyAsNull],
  )
  return (
    <div className="flex flex-col gap-1 p-2">
      <label className="font-bold text-left" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="border border-gray-500 rounded p-1" {...register(id, {setValueAs})}>
        {groups
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {renderOptions(group.options)}
              </optgroup>
            ))
          : renderOptions(options)}
      </select>
    </div>
  );
};

export default LabeledSelect;
