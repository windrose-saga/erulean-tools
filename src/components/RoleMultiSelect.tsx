import * as React from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { Role, ROLES } from '../types/unit';

export interface RoleMultiSelectProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
}

const RoleMultiSelect = <T extends FieldValues>({ label, id }: RoleMultiSelectProps<T>) => {
  const { watch, setValue } = useFormContext<T>();
  const watched = watch(id);
  const selected = React.useMemo(() => (watched ?? []) as Array<Role>, [watched]);

  const toggleRole = React.useCallback(
    (role: Role) => {
      const next = selected.includes(role)
        ? selected.filter((r) => r !== role)
        : [...selected, role];
      setValue(id, next as PathValue<T, Path<T>>, { shouldDirty: true });
    },
    [selected, setValue, id],
  );

  return (
    <div className="flex flex-col gap-1 p-2">
      <span className="font-bold text-left">{label}</span>
      <div className="flex flex-wrap gap-3">
        {ROLES.map((role) => (
          <label key={role} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(role)}
              onChange={() => toggleRole(role)}
            />
            {role}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleMultiSelect;
