import { FieldValues, Path, useFormContext } from 'react-hook-form';

export interface LabeledSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  options: Array<{ name: string; value: string }>;
}

const LabeledSelect = <T extends FieldValues>({ label, id, options }: LabeledSelectProps<T>) => {
  const { register } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-1 p-2">
      <label className="font-bold text-left" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="border border-gray-500 rounded p-1" {...register(id)}>
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
