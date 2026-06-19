export type Column<T> = {
  name: string;
  field: keyof T;
  sortable?: boolean;
  editable?: boolean;
  options?: readonly string[];
};

export type OnCellEdit<T> = <K extends keyof T>(item: T, field: K, value: T[K]) => void;
