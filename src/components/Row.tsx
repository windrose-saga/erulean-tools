import { Column } from "../types/list";

interface RowProps<T> {
  item: T;
  columns: Column<T>[];
  defaultIndex: keyof T;
}

export const Row = <T extends object>({
  item,
  columns,
  defaultIndex,
}: RowProps<T>) => {
  return (
    <tr>
      <td>{[item[defaultIndex]].toString()}</td>
      {columns.map((column) => (
        <td key={column.name}>{item[column.field]?.toString()}</td>
      ))}
    </tr>
  );
};
