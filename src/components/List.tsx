import { useCallback, useMemo, useState } from 'react';

import { ColumnFilter } from './ColumnFilter';
import { Row } from './Row';

import { Column } from '../types/list';
import { useColumnVisibility } from '../utils/useColumnVisibility';

interface ListProps<T> {
  items: T[];
  columns: Column<T>[];
  defaultIndex: keyof T;
  onRowClick?: (item: T) => void;
  searchFields: Array<keyof T>;
}

export const List = <T extends object>({
  items,
  columns,
  defaultIndex,
  onRowClick,
  searchFields,
}: ListProps<T>) => {
  const [sortField, setSortField] = useState<keyof T>(defaultIndex);
  const [reverse, setReverse] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { columnState, visibleColumns, toggleColumn } = useColumnVisibility(columns);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      }),
    );
  }, [items, searchTerm, searchFields]);

  const sortedItems = useMemo(() => {
    if (!filteredItems.length) {
      return filteredItems;
    }
    const multiplier = reverse ? -1 : 1;
    if (typeof filteredItems[0][sortField] === 'string') {
      return filteredItems.sort(
        (a, b) => (a[sortField] as string).localeCompare(b[sortField] as string) * multiplier,
      );
    }
    if (typeof filteredItems[0][sortField] === 'number') {
      return filteredItems.sort(
        (a, b) => ((a[sortField] as number) - (b[sortField] as number)) * multiplier,
      );
    }
    return filteredItems.sort(
      (a, b) => ((a[sortField] ? 0 : 1) - (b[sortField] ? 0 : 1)) * multiplier,
    );
  }, [filteredItems, sortField, reverse]);

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
    <div>
      <div className="flex flex-row">
        <p>Search:</p> <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <ColumnFilter columns={columns} columnState={columnState} onColumnPress={toggleColumn} />
      <table>
        <thead>
          <tr>
            <th
              onClick={() => {
                onColumnPress(defaultIndex);
              }}
            />
            {visibleColumns.map((column) => (
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
              columns={visibleColumns}
              defaultIndex={defaultIndex}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
