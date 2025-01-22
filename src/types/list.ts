export type Column<T> = {
  name: string;
  field: keyof T;
  sortable?: boolean;
};
