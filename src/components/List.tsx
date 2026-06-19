import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import { ColumnFilter } from './ColumnFilter';
import { Row } from './Row';

import { Column, OnCellEdit } from '../types/list';
import { assertUnreachable } from '../utils/assertUnreachable';
import { useColumnVisibility } from '../utils/useColumnVisibility';

interface ListProps<T> {
  items: T[];
  columns: Column<T>[];
  defaultIndex: keyof T;
  onRowClick?: (item: T) => void;
  onCellEdit?: OnCellEdit<T>;
  searchFields: Array<keyof T>;
  objectCreationType:
    | 'unit'
    | 'action'
    | 'augment'
    | 'item'
    | 'prefab'
    | 'expLevelClass'
    | 'pvLevelClass'
    | 'gridLevelClass'
    | 'dungeonGridLevelClass';
}

export const List = <T extends object>({
  items,
  columns,
  defaultIndex,
  onRowClick,
  onCellEdit,
  searchFields,
  objectCreationType,
}: ListProps<T>) => {
  const [sortField, setSortField] = useState<keyof T>(defaultIndex);
  const [reverse, setReverse] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { columnState, visibleColumns, toggleColumn } = useColumnVisibility(columns);

  const canEdit = !!onCellEdit && columns.some((column) => column.editable);

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
    const sortableItems = [...filteredItems];
    const multiplier = reverse ? -1 : 1;
    if (typeof sortableItems[0][sortField] === 'string') {
      return sortableItems.sort(
        (a, b) => (a[sortField] as string).localeCompare(b[sortField] as string) * multiplier,
      );
    }
    if (typeof sortableItems[0][sortField] === 'number') {
      return sortableItems.sort(
        (a, b) => ((a[sortField] as number) - (b[sortField] as number)) * multiplier,
      );
    }
    return sortableItems.sort(
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

  const createObjectPath = useMemo(() => {
    switch (objectCreationType) {
      case 'unit':
        return '/units/new';
      case 'action':
        return '/actions/new';
      case 'augment':
        return '/augments/new';
      case 'item':
        return '/items/new';
      case 'prefab':
        return '/prefabs/new';
      case 'expLevelClass':
        return '/exp-level-classes/new';
      case 'pvLevelClass':
        return '/pv-level-classes/new';
      case 'gridLevelClass':
        return '/grid-level-classes/new';
      case 'dungeonGridLevelClass':
        return '/dungeon-grid-level-classes/new';
      default:
        assertUnreachable(objectCreationType);
        return '/';
    }
  }, [objectCreationType]);

  return (
    <div className="table-wrapper">
      <div className="flex flex-row">
        <Link to={createObjectPath}>
          <button>Create New</button>
        </Link>
        {canEdit && (
          <button type="button" onClick={() => setEditMode((value) => !value)}>
            {editMode ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      <div className="flex flex-row">
        <p>Search:</p>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
              onCellEdit={onCellEdit}
              editMode={editMode}
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
