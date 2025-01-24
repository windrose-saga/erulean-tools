import { useCallback, useMemo, useState } from 'react';

import { Column } from '../types/list';

export const useColumnVisibility = <T extends object>(columns: Column<T>[]) => {
  const [columnState, setColumnState] = useState<Record<keyof T, boolean>>(
    columns.reduce(
      (acc, column) => {
        acc[column.field] = true;
        return acc;
      },
      {} as Record<keyof T, boolean>,
    ),
  );

  const toggleColumn = useCallback((column: Column<T>) => {
    setColumnState((prevState) => ({
      ...prevState,
      [column.field]: !prevState[column.field],
    }));
  }, []);

  const visibleColumns = useMemo(
    () => columns.filter((column) => columnState[column.field]),
    [columnState, columns],
  );

  return {
    columnState,
    toggleColumn,
    visibleColumns,
  };
};
