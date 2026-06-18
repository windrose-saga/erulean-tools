import * as React from 'react';

import { isValidVocabId, normalizeVocabId } from '../utils/vocabId';

export interface TagMatrixRow {
  guid: string;
  id: string;
  name: string;
}

export interface TagMatrixProps<T extends TagMatrixRow> {
  // Rows down the Y axis (units / items).
  rows: Array<T>;
  // Active tag/category names across the X axis.
  columns: Array<string>;
  // Singular noun used in the add-column field, e.g. "tag" / "category".
  noun: string;
  // The tags/categories currently assigned to a row.
  getValues: (row: T) => Array<string>;
  // Toggle a single column on/off for a single row.
  onToggle: (row: T, column: string, next: boolean) => void;
  // Add a new column (tag/category) to the global vocabulary.
  onAddColumn: (name: string) => void;
}

// A two-axis editor: rows (units/items) × columns (tags/categories), each cell a checkbox that
// assigns/unassigns the column value on the row inline. Adding a column commits a new value to the
// global vocabulary. Renaming/removing columns stays in the dedicated manager view.
export const TagMatrix = <T extends TagMatrixRow>({
  rows,
  columns,
  noun,
  getValues,
  onToggle,
  onAddColumn,
}: TagMatrixProps<T>) => {
  const [search, setSearch] = React.useState('');
  const [draft, setDraft] = React.useState('');

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return rows;
    }
    return rows.filter(
      (row) => row.name.toLowerCase().includes(query) || row.id.toLowerCase().includes(query),
    );
  }, [rows, search]);

  const submitAdd = React.useCallback(() => {
    const normalized = normalizeVocabId(draft);
    if (!isValidVocabId(normalized)) {
      return;
    }
    onAddColumn(normalized);
    setDraft('');
  }, [draft, onAddColumn]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          className="border px-2 py-1"
          placeholder="Search by name or id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="text"
            className="border px-2 py-1"
            placeholder={`Add ${noun} (UPPER_CASE)`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitAdd();
              }
            }}
          />
          <button type="button" className="border px-3 py-1" onClick={submitAdd}>
            Add
          </button>
        </div>
      </div>

      <div className="tag-matrix-scroll">
        <table className="tag-matrix">
          <thead>
            <tr>
              <th>Name</th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const values = getValues(row);
              return (
                <tr key={row.guid}>
                  <td className="tag-matrix-row-label">{row.name}</td>
                  {columns.map((column) => {
                    const checked = values.includes(column);
                    return (
                      <td key={column}>
                        <input
                          type="checkbox"
                          aria-label={`${row.name}: ${column}`}
                          checked={checked}
                          onChange={(e) => onToggle(row, column, e.target.checked)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1}>No matches.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
