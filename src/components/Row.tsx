import * as React from "react";
import { Column } from "../types/list";

interface RowProps<T> {
  item: T;
  columns: Column<T>[];
  defaultIndex: keyof T;
  onRowClick?: (item: T) => void;
}

export const Row = <T extends object>({
  item,
  columns,
  defaultIndex,
  onRowClick,
}: RowProps<T>) => {
  const onClick = React.useCallback(() => {
    if (!onRowClick) {
      return;
    }
    onRowClick(item);
  }, [onRowClick, item]);

  return (
    <tr onClick={onClick}>
      <td>{[item[defaultIndex]].toString()}</td>
      {columns.map((column) => (
        <td key={column.name}>{item[column.field]?.toString()}</td>
      ))}
    </tr>
  );
};
