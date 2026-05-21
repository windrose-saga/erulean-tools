import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { Faction, FACTIONS } from '../types/unit';

export interface FactionMultiSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const FactionMultiSelect = <T extends FieldValues>({
  label,
  id,
}: FactionMultiSelectProps<T>) => {
  const { watch, setValue } = useFormContext<T>();
  const watched = watch(id);
  const selected = React.useMemo(() => (watched ?? []) as Array<Faction>, [watched]);

  const toggleFaction = React.useCallback(
    (faction: Faction) => {
      const next = selected.includes(faction)
        ? selected.filter((f) => f !== faction)
        : [...selected, faction];
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [selected, setValue, id],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {FACTIONS.map((faction) => (
          <label key={faction} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(faction)}
              onChange={() => toggleFaction(faction)}
            />
            {faction}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FactionMultiSelect;
