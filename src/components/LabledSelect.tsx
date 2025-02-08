import * as React from 'react'
import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface LabeledSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  options: Array<{ name: string; value: string }>;
  treatEmptyAsNull?: boolean;
}

const LabeledSelect = <T extends FieldValues>({ label, id, options , treatEmptyAsNull = true}: LabeledSelectProps<T>) => {
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
        {options.map(({ name, value }) => (
          <option key={name} value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LabeledSelect;
