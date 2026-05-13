import type { RowData } from "@tanstack/react-table";

/* eslint-disable @typescript-eslint/no-unused-vars -- generic parameters mirror TanStack's ColumnMeta */
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
  }
}
