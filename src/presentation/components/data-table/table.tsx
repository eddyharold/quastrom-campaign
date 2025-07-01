import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Label } from "@/presentation/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/presentation/components/ui/table";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { cn } from "@/domain/utils/common";

type DataTableProps<T> = {
  data: T[];
  rowCount?: number;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  classNames?: {
    table?: string;
    tableHeader?: string;
    tableHead?: string;
    tableBody?: string;
    tableRow?: {
      header?: string;
      body?: string;
    };
    tableCell?: string;
  };
  autoPagination?: boolean;
  rowSelectable?: boolean;
  onRowSelectionChange?: (rows: T[]) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
};

export function DataTable<T>({
  data,
  rowCount = 0,
  columns: initialColumns,
  isLoading = false,
  emptyMessage,
  classNames,
  autoPagination = false,
  rowSelectable = true,
  onRowSelectionChange,
  onPaginationChange,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<T>[] = React.useMemo(() => {
    return [
      ...(rowSelectable
        ? []
        : ([
            {
              id: "select",
              header: ({ table }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Sélectionner tout"
                  />
                </div>
              ),
              cell: ({ row }) => (
                <div className="flex items-center">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Sélectionner la ligne"
                  />
                </div>
              ),
              meta: {
                className: "w-8",
              },
              enableSorting: false,
              enableHiding: false,
            },
          ] as ColumnDef<T>[])),
      ...initialColumns,
    ];
  }, [initialColumns, rowSelectable]);

  const handleUpdatePagination = (updaterOrValue: Updater<PaginationState>) => {
    let paginationUpdate: PaginationState;

    if (typeof updaterOrValue === "function") {
      paginationUpdate = updaterOrValue(pagination);
    } else {
      paginationUpdate = updaterOrValue;
    }

    onPaginationChange?.(paginationUpdate);
    setPagination(paginationUpdate);
  };

  const handleRowSelection = (updaterOrValue: Updater<RowSelectionState>) => {
    let rowSelectionUpdate: RowSelectionState;

    if (typeof updaterOrValue === "function") {
      rowSelectionUpdate = updaterOrValue(rowSelection);
    } else {
      rowSelectionUpdate = updaterOrValue;
    }

    setRowSelection(rowSelectionUpdate);
    onRowSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
  };

  const table = useReactTable({
    data,
    columns,

    rowCount,

    manualPagination: !autoPagination,
    manualFiltering: true,
    manualSorting: true,
    enableRowSelection: rowSelectable,

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },

    onRowSelectionChange: rowSelectable ? handleRowSelection : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: autoPagination ? handleUpdatePagination : undefined,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    ...(autoPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  });

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table className={classNames?.table}>
          <TableHeader className={cn("bg-muted", classNames?.tableHeader)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className={cn("hover:bg-transparent", classNames?.tableRow?.header)} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const className = header.column.columnDef.meta?.className;
                  const style = header.column.columnDef.meta?.styles;

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(classNames?.tableHead, className)}
                      style={style}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className={cn("**:data-[slot=table-cell]:first:w-8", classNames?.tableBody)}>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                  {columns.map((column, cellIndex) => {
                    const className = column.meta?.className;
                    const style = column.meta?.styles;

                    return (
                      <TableCell key={`skeleton-cell-${index}-${cellIndex}`} className={className} style={style}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={classNames?.tableRow?.body}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const className = cell.column.columnDef.meta?.className;
                    const style = cell.column.columnDef.meta?.styles;

                    return (
                      <TableCell key={cell.id} className={cn(classNames?.tableCell, className)} style={style}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage || "Aucun résultat."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
          sélectionnée(s).
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Lignes par page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la première page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Aller à la page précédente</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la page suivante</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Aller à la dernière page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
