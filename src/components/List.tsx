import { useCallback, useMemo, useState } from 'react';

import { Row } from './Row';

import { Column } from '../types/list';

interface ListProps<T> {
  items: T[];
  columns: Column<T>[];
  defaultIndex: keyof T;
  onRowClick?: (item: T) => void;
}

export const List = <T extends object>({
  items,
  columns,
  defaultIndex,
  onRowClick,
}: ListProps<T>) => {
  const [sortField, setSortField] = useState<keyof T>(defaultIndex);
  const [reverse, setReverse] = useState(false);

  const sortedItems = useMemo(() => {
    const multiplier = reverse ? -1 : 1;
    if (typeof items[0][sortField] === 'string') {
      return items.sort(
        (a, b) => (a[sortField] as string).localeCompare(b[sortField] as string) * multiplier,
      );
    }
    if (typeof items[0][sortField] === 'number') {
      return items.sort(
        (a, b) => ((a[sortField] as number) - (b[sortField] as number)) * multiplier,
      );
    }
    return items.sort((a, b) => ((a[sortField] ? 0 : 1) - (b[sortField] ? 0 : 1)) * multiplier);
  }, [items, sortField, reverse]);

  const onColumnPress = useCallback(
    (field: keyof T) => {
      if (field === sortField) {
        setReverse(!reverse);
      } else {
        setSortField(field);
      }
    },
    [reverse, sortField],
  );

  return (
    <table>
      <thead>
        <tr>
          <th
            onClick={() => {
              onColumnPress(defaultIndex);
            }}
          />
          {columns.map((column) => (
            <th
              key={column.name}
              onClick={() => {
                onColumnPress(column.field);
              }}
            >
              {column.name}
              <span className={sortField === column.field ? '' : 'invisible'}>
                {reverse ? '▼' : '▲'}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item) => (
          <Row
            key={item[defaultIndex] as string}
            onRowClick={onRowClick}
            item={item}
            columns={columns}
            defaultIndex={defaultIndex}
          />
        ))}
      </tbody>
    </table>
  );
};
