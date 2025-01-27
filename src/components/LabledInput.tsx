import { HTMLInputTypeAttribute, KeyboardEvent } from 'react';
import { FieldValues, Path, get, useFormContext } from 'react-hook-form';

export interface LabeledInputProps<
  T extends FieldValues,
  K extends HTMLInputTypeAttribute = HTMLInputTypeAttribute,
> {
  label: string;
  type?: K;
  id: Path<T>;
  allowFloats?: boolean;
  pattern?: string;
}

const LabeledInput = <
  T extends FieldValues,
  K extends HTMLInputTypeAttribute = HTMLInputTypeAttribute,
>({
  label,
  id,
  type = 'text' as K,
  allowFloats = true,
}: LabeledInputProps<T, K>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, id).message as string;
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!allowFloats && (event.key === '.' || event.key === 'e')) {
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2">
      <label className="font-bold text-left" htmlFor={id}>
        {label}
      </label>
      <input className="rounded" onKeyDown={handleKeyDown} type={type} id={id} {...register(id)} />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default LabeledInput;
