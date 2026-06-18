import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { useActiveGeneratorTags } from '../store/getters/vocab';
import { useGameStore } from '../store/useGameStore';
import { GeneratorTag } from '../types/unit';
import { isValidVocabId, normalizeVocabId } from '../utils/vocabId';

export interface GeneratorTagMultiSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const GeneratorTagMultiSelect = <T extends FieldValues>({
  label,
  id,
}: GeneratorTagMultiSelectProps<T>) => {
  const { watch, setValue } = useFormContext<T>();
  const watched = watch(id);
  const selected = React.useMemo(() => (watched ?? []) as Array<GeneratorTag>, [watched]);
  const tags = useActiveGeneratorTags();
  const addGeneratorTag = useGameStore.use.addGeneratorTag();
  const [draft, setDraft] = React.useState('');

  const setSelected = React.useCallback(
    (next: Array<GeneratorTag>) => {
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [setValue, id],
  );

  const toggleGeneratorTag = React.useCallback(
    (generatorTag: GeneratorTag) => {
      setSelected(
        selected.includes(generatorTag)
          ? selected.filter((t) => t !== generatorTag)
          : [...selected, generatorTag],
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
    addGeneratorTag(normalized);
    if (!selected.includes(normalized)) {
      setSelected([...selected, normalized]);
    }
    setDraft('');
  }, [draft, addGeneratorTag, selected, setSelected]);

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {tags.map((generatorTag) => (
          <label key={generatorTag} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(generatorTag)}
              onChange={() => toggleGeneratorTag(generatorTag)}
            />
            {generatorTag}
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="border px-1"
          placeholder="Add tag"
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

export default GeneratorTagMultiSelect;
