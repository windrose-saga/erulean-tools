import * as React from 'react';

import { Column, OnCellEdit } from '../types/list';

interface RowProps<T> {
  item: T;
  columns: Column<T>[];
  defaultIndex: keyof T;
  editMode: boolean;
  onRowClick?: (item: T) => void;
  onCellEdit?: OnCellEdit<T>;
}

const isScalar = (value: unknown): value is string | number | boolean =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

export const Row = <T extends object>({
  item,
  columns,
  defaultIndex,
  editMode,
  onRowClick,
  onCellEdit,
}: RowProps<T>) => {
  const onClick = React.useCallback(() => {
    if (editMode || !onRowClick) {
      return;
    }
    onRowClick(item);
  }, [editMode, onRowClick, item]);

  const commit = <K extends keyof T>(field: K, value: T[K]) => {
    onCellEdit?.(item, field, value);
  };

  return (
    <tr onClick={onClick}>
      <td>{[item[defaultIndex]].toString()}</td>
      {columns.map((column) => {
        const value = item[column.field];

        if (editMode && column.editable && onCellEdit && isScalar(value)) {
          if (column.options) {
            return (
              <td key={column.name}>
                <select
                  defaultValue={value as string}
                  onChange={(e) =>
                    commit(column.field, e.currentTarget.value as T[typeof column.field])
                  }
                >
                  {column.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            );
          }
          if (typeof value === 'boolean') {
            return (
              <td key={column.name}>
                <input
                  type="checkbox"
                  defaultChecked={value}
                  onChange={(e) =>
                    commit(column.field, e.currentTarget.checked as T[typeof column.field])
                  }
                />
              </td>
            );
          }
          if (typeof value === 'number') {
            return (
              <td key={column.name}>
                <input
                  type="number"
                  defaultValue={value}
                  onBlur={(e) => {
                    const next = e.currentTarget.valueAsNumber;
                    if (Number.isFinite(next)) {
                      commit(column.field, next as T[typeof column.field]);
                    } else {
                      e.currentTarget.value = value.toString();
                    }
                  }}
                />
              </td>
            );
          }
          return (
            <td key={column.name}>
              <input
                type="text"
                defaultValue={value as string}
                onBlur={(e) =>
                  commit(column.field, e.currentTarget.value as T[typeof column.field])
                }
              />
            </td>
          );
        }

        if (typeof value === 'boolean') {
          return <td key={column.name}>{value ? <span>&#10003;</span> : ''} </td>;
        }
        return <td key={column.name}>{value?.toString()}</td>;
      })}
    </tr>
  );
};
