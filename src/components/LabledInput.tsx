import React, { HTMLInputTypeAttribute, KeyboardEvent } from 'react';
import { FieldValues, Path, ValidationRule, get, useFormContext } from 'react-hook-form';

export interface LabeledInputProps<
  T extends FieldValues,
  K extends HTMLInputTypeAttribute = HTMLInputTypeAttribute,
> {
  label: string;
  type?: K;
  id: Path<T>;
  allowFloats?: boolean;
  allowNegativeValue?: boolean;
  pattern?: ValidationRule<RegExp> | undefined;
  required?: boolean;
  validate?: (value: string) => boolean | string;
}

const LabeledInput = <
  T extends FieldValues,
  K extends HTMLInputTypeAttribute = HTMLInputTypeAttribute,
>({
  label,
  id,
  type = 'text' as K,
  allowFloats = true,
  allowNegativeValue = false,
  pattern,
  required = false,
  validate,
}: LabeledInputProps<T, K>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = React.useMemo(() => get(errors, id)?.message as string, [errors, id]);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const floatCondition = (!allowFloats && event.key === '.') || event.key === 'e';
      const negativeCondition = !allowNegativeValue && event.key === '-';
      if (type === 'number' && (floatCondition || negativeCondition)) {
        event.preventDefault();
      }
    },
    [allowFloats, allowNegativeValue, type],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      <label className="font-bold text-left" htmlFor={id}>
        {label}
      </label>
      <input
        className="rounded"
        onKeyDown={handleKeyDown}
        type={type}
        id={id}
        {...register(id, { required, validate, pattern })}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default LabeledInput;
