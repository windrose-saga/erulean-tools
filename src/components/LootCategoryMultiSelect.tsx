import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { useActiveLootCategories } from '../store/getters/vocab';
import { useGameStore } from '../store/useGameStore';
import { LootCategory } from '../types/item';
import { isValidVocabId, normalizeVocabId } from '../utils/vocabId';

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
  const categories = useActiveLootCategories();
  const addLootCategory = useGameStore.use.addLootCategory();
  const [draft, setDraft] = React.useState('');

  const setSelected = React.useCallback(
    (next: Array<LootCategory>) => {
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [setValue, id],
  );

  const toggleCategory = React.useCallback(
    (category: LootCategory) => {
      setSelected(
        selected.includes(category)
          ? selected.filter((c) => c !== category)
          : [...selected, category],
      );
    },
    [selected, setSelected],
  );

  // Inline add commits the new value to the global vocabulary immediately and selects it on the
  // current entity.
  const onAdd = React.useCallback(() => {
    const normalized = normalizeVocabId(draft);
    if (!isValidVocabId(normalized)) {
      return;
    }
    addLootCategory(normalized);
    if (!selected.includes(normalized)) {
      setSelected([...selected, normalized]);
    }
    setDraft('');
  }, [draft, addLootCategory, selected, setSelected]);

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
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
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="border px-1"
          placeholder="Add category"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <button type="button" className="border px-2" onClick={onAdd}>
          Add
        </button>
      </div>
    </div>
  );
};

export default LootCategoryMultiSelect;
