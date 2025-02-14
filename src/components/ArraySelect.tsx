import { produce } from 'immer';
import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useUnits } from '../store/getters/unit';
import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Unit } from '../types/unit';
import { assertUnreachable } from '../utils/assertUnreachable';

export interface ArraySelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  type: 'UNIT' | 'ACTION' | 'AUGMENT';
}

const mapFromInitalValue = (initialValue: Array<string>) => {
  const formattedItems = new Map<string, string>();
  initialValue.forEach((guid) => {
    formattedItems.set(crypto.randomUUID(), guid);
  });
  return formattedItems;
};

const ArraySelect = <T extends FieldValues>({ label, id, type }: ArraySelectProps<T>) => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();

  const options = React.useMemo(() => {
    let optionData: Unit[] | Action[] | Augment[];

    switch (type) {
      case 'UNIT':
        optionData = units;
        break;
      case 'ACTION':
        optionData = actions;
        break;
      case 'AUGMENT':
        optionData = augments;
        break;
      default:
        assertUnreachable(type);
        optionData = [];
        break;
    }

    return optionData.map((option) => ({
      name: option.name,
      value: option.guid,
    }));
  }, [actions, augments, type, units]);

  const [initialized, setInitialized] = React.useState(false);

  const { getValues, setValue } = useFormContext<T>();

  const [items, setItems] = React.useState<Map<string, string>>(new Map());

  React.useEffect(() => {
    if (!initialized) {
      setItems(mapFromInitalValue(getValues(id)));
      setInitialized(true);
    }
  }, [getValues, id, initialized]);

  React.useEffect(() => {
    setValue(id, Array.from(items.values()) as PathValue<T, Path<T>>, {
      shouldDirty: true,
    });
  }, [items, setValue, id]);

  const addItem = React.useCallback(() => {
    setItems((current) =>
      produce(current, (draft) => {
        draft.set(crypto.randomUUID(), options[0].value);
      }),
    );
  }, [options]);

  const removeItem = React.useCallback(
    (key: string) => () => {
      setItems((current) =>
        produce(current, (draft) => {
          draft.delete(key);
        }),
      );
    },
    [],
  );

  const updateItem = React.useCallback(
    (key: string, newValue: string) =>
      setItems((current) =>
        produce(current, (draft) => {
          draft.set(key, newValue);
        }),
      ),
    [],
  );

  const rows = React.useMemo(
    () =>
      Array.from(items).map(([key, value]) => (
        <li key={key} className="flex gap-2">
          <ControlledSelect
            options={options}
            value={value}
            onValueChange={(newValue) => updateItem(key, newValue)}
          />
          <button type="button" className="text-red-500" onClick={removeItem(key)}>
            Remove
          </button>
        </li>
      )),
    [items, removeItem, updateItem, options],
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-left" htmlFor={id}>
        {label}
      </label>
      <ul className="flex flex-col gap-1">{rows}</ul>
      <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded" onClick={addItem}>
        Add
      </button>
    </div>
  );
};
export default ArraySelect;

const ControlledSelect = ({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ name: string; value: string }>;
}) => (
  <select onChange={(e) => onValueChange(e.target.value)} value={value}>
    {options.map(({ name, value: optionValue }) => (
      <option key={optionValue} value={optionValue}>
        {name}
      </option>
    ))}
  </select>
);
