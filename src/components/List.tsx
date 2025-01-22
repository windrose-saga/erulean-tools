import { useCallback, useMemo, useState } from "react";
import { Column } from "../types/list";
import { Row } from "./Row";

interface ListProps<T> {
  items: T[];
  columns: Column<T>[];
  defaultIndex: keyof T;
}

export const List = <T extends object>({
  items,
  columns,
  defaultIndex,
}: ListProps<T>) => {
  const [sortField, setSortField] = useState<keyof T>(defaultIndex);
  const [reverse, setReverse] = useState(false);

  const sortedItems = useMemo(() => {
    const multiplier = reverse ? -1 : 1;
    if (typeof items[0][sortField] === "string") {
      return items.sort(
        (a, b) =>
          (a[sortField] as string).localeCompare(b[sortField] as string) *
          multiplier
      );
    } else if (typeof items[0][sortField] === "number") {
      return items.sort(
        (a, b) =>
          ((a[sortField] as number) - (b[sortField] as number)) * multiplier
      );
    } else {
      return items.sort(
        (a, b) => ((a[sortField] ? 0 : 1) - (b[sortField] ? 0 : 1)) * multiplier
      );
    }
  }, [items, sortField, reverse]);

  const onColumnPress = useCallback(
    (field: keyof T) => {
      if (field === sortField) {
        setReverse(!reverse);
      } else {
        setSortField(field);
        g;
      }
    },
    [reverse, sortField]
  );

  return (
    <table>
      <thead>
        <tr>
          <th
            onClick={() => {
              onColumnPress(defaultIndex);
            }}
          ></th>
          {columns.map((column) => (
            <th
              key={column.name}
              onClick={() => {
                onColumnPress(column.field);
              }}
            >
              {column.name}
              <span className={sortField === column.field ? "" : "invisible"}>
                {reverse ? "▼" : "▲"}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item) => (
          <Row item={item} columns={columns} defaultIndex={defaultIndex}></Row>
        ))}
      </tbody>
    </table>
  );
};
