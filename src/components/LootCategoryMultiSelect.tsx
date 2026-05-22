import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { LootCategory, LOOT_CATEGORIES } from '../types/item';

export interface LootCategoryMultiSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const LootCategoryMultiSelect = <T extends FieldValues>({
  label,
  id,
}: LootCategoryMultiSelectProps<T>) => {
  const { watch, setValue } = useFormContext<T>();
  const watched = watch(id);
  const selected = React.useMemo(() => (watched ?? []) as Array<LootCategory>, [watched]);

  const toggleCategory = React.useCallback(
    (category: LootCategory) => {
      const next = selected.includes(category)
        ? selected.filter((c) => c !== category)
        : [...selected, category];
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [selected, setValue, id],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {LOOT_CATEGORIES.map((category) => (
          <label key={category} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LootCategoryMultiSelect;
