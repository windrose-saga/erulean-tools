import { produce } from 'immer';
import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { useActions } from '../store/getters/action';
import { useAugments } from '../store/getters/augment';
import { useItems } from '../store/getters/item';
import { useUnits } from '../store/getters/unit';
import { Action } from '../types/action';
import { Augment } from '../types/augment';
import { Item } from '../types/item';
import { Unit } from '../types/unit';
import { assertUnreachable } from '../utils/assertUnreachable';

export interface QuantitySelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  type: 'UNIT' | 'ACTION' | 'AUGMENT' | 'ITEM';
}

const mapFromInitialValue = (initialValue: Record<string, number>) => {
  const formattedItems = new Map<string, { guid: string; quantity: number }>();
  Object.entries(initialValue).forEach(([guid, quantity]) => {
    formattedItems.set(crypto.randomUUID(), { guid, quantity });
  });
  return formattedItems;
};

const QuantitySelect = <T extends FieldValues>({ label, id, type }: QuantitySelectProps<T>) => {
  const units = useUnits();
  const actions = useActions();
  const augments = useAugments();
  const itemsData = useItems();

  const options = React.useMemo(() => {
    let optionData: Unit[] | Action[] | Augment[] | Item[];

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
      case 'ITEM':
        optionData = itemsData;
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
  }, [actions, augments, itemsData, type, units]);

  const [initialized, setInitialized] = React.useState(false);

  const { getValues, setValue } = useFormContext<T>();

  const [items, setItems] = React.useState<Map<string, { guid: string; quantity: number }>>(
    new Map(),
  );

  React.useEffect(() => {
    if (!initialized) {
      const currentValue = getValues(id);
      // Handle both old array format and new object format for backwards compatibility
      if (Array.isArray(currentValue)) {
        // Convert old array format to new object format
        const converted: Record<string, number> = {};
        currentValue.forEach((guid: string) => {
          converted[guid] = (converted[guid] || 0) + 1;
        });
        setItems(mapFromInitialValue(converted));
      } else if (currentValue && typeof currentValue === 'object') {
        setItems(mapFromInitialValue(currentValue as Record<string, number>));
      }
      setInitialized(true);
    }
  }, [getValues, id, initialized]);

  React.useEffect(() => {
    const result: Record<string, number> = {};
    items.forEach(({ guid, quantity }: { guid: string; quantity: number }) => {
      result[guid] = quantity;
    });
    setValue(id, result as PathValue<T, Path<T>>, {
      shouldDirty: true,
    });
  }, [items, setValue, id]);

  const addItem = React.useCallback(() => {
    setItems((current) =>
      produce(current, (draft) => {
        draft.set(crypto.randomUUID(), { guid: options[0].value, quantity: 1 });
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

  const updateItemGuid = React.useCallback(
    (key: string, newGuid: string) =>
      setItems((current) =>
        produce(current, (draft) => {
          const item = draft.get(key);
          if (item) {
            item.guid = newGuid;
          }
        }),
      ),
    [],
  );

  const updateItemQuantity = React.useCallback(
    (key: string, newQuantity: number) =>
      setItems((current) =>
        produce(current, (draft) => {
          const item = draft.get(key);
          if (item) {
            item.quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
          }
        }),
      ),
    [],
  );

  const rows = React.useMemo(
    () =>
      Array.from(items).map(([key, { guid, quantity }]) => (
        <li key={key} className="flex gap-2 items-center">
          <ControlledSelect
            options={options}
            value={guid}
            onValueChange={(newValue) => updateItemGuid(key, newValue)}
          />
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => updateItemQuantity(key, parseInt(e.target.value, 10) || 1)}
            className="w-20 px-2 py-1 border rounded"
          />
          <button type="button" className="text-red-500" onClick={removeItem(key)}>
            Remove
          </button>
        </li>
      )),
    [items, removeItem, updateItemGuid, updateItemQuantity, options],
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
export default QuantitySelect;

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
