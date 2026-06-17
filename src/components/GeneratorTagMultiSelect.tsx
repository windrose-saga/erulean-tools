import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { GeneratorTag, GENERATOR_TAGS } from '../types/unit';

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

  const toggleGeneratorTag = React.useCallback(
    (generatorTag: GeneratorTag) => {
      const next = selected.includes(generatorTag)
        ? selected.filter((t) => t !== generatorTag)
        : [...selected, generatorTag];
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [selected, setValue, id],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {GENERATOR_TAGS.map((generatorTag) => (
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
    </div>
  );
};

export default GeneratorTagMultiSelect;
