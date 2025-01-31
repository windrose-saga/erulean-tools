import { Column } from '../types/list';

interface ColumnFilterProps<T> {
  columns: Column<T>[];
  columnState: Record<keyof T, boolean>;
  onColumnPress: (column: Column<T>) => void;
}

export const ColumnFilter = <T extends object>({
  columns,
  columnState,
  onColumnPress,
}: ColumnFilterProps<T>) => (
  <div className="flex flex-row gap-2">
    {columns.map((column) => (
      <div className="flex flex-row gap-2" key={column.name}>
        <input
          type="checkbox"
          checked={columnState[column.field]}
          onChange={() => onColumnPress(column)}
        />
        <p className="text-xs whitespace-nowrap">{column.name}</p>
      </div>
    ))}
  </div>
);
