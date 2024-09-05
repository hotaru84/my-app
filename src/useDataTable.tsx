import { Thead, Tr, Th, chakra, Icon, Tbody, Td, Table as ChakraTable, Box, Divider, IconButton } from "@chakra-ui/react";
import { ColumnDef, ColumnFiltersState, SortingState, PaginationState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { format } from "date-fns";
import { ReactElement, useState, useCallback } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import { TbChevronDown, TbChevronUp, TbDragDrop } from "react-icons/tb";

type DataTable = {
  makeCsvData: () => string;
  addFilter: (id: string, value: unknown) => void;
  removeFilter: (id: string) => void;
  renderTable: () => ReactElement;
  rowCount: () => number;
  filteredRowCount: () => number;
  pageIndex: number;
  pageCount: () => number;
  canPreviousPage: () => boolean;
  canNextPage: () => boolean;
  previousPage: () => void;
  nextPage: () => void;
}

export function useDataTable<T>(columns: ColumnDef<T, any>[], data: T[], maxRowInPage?: number): DataTable {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // can set initial column filter state here
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: maxRowInPage ?? 100,
  });

  const table = useReactTable<T>({
    columns,
    data,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters
    },
  });
  const makeCsvData = useCallback((): string => {
    const formatValueForCsv = (v: any) => {
      if (typeof v === 'string') return '"' + v + '"';
      if (Object.prototype.toString.call(v) === "[object Date]") return '"' + format(v, 'PP p') + '"';
      return v;
    }
    const csvheader = table.getHeaderGroups().map((g) => g.headers.map((h) => "#" + h.id)).join(',') + ',\n';
    const csv = table.getFilteredRowModel().rows.map(
      (r) => r.getAllCells().map((c, i) => formatValueForCsv(c.getValue())).join(',')
    ).join(",\n");

    return csvheader + csv;
  }, [table]);

  const renderTable = useCallback(() => <ChakraTable variant='simple' width={table.getCenterTotalSize()}>
    <Thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <Tr key={headerGroup.id} position={'sticky'} top={0} boxShadow={'sm'} bgColor={'white'} _dark={{ bgColor: 'gray.700' }}>
          {headerGroup.headers.map(header => (
            <Th
              key={header.id}
              colSpan={header.colSpan}
              width={header.getSize()}
              position={"relative"}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}

              <Box
                position={"absolute"}
                bottom={0}
                right={0}
                onDoubleClick={() => header.column.resetSize()}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                cursor={'col-resize'}
                w={4}
                _hover={{ borderRightWidth: 1 }}
                h="full"
              />
            </Th>
          ))}
        </Tr>
      ))}
    </Thead>
    <Tbody>
      {table.getRowModel().rows.map((row) => (
        <Tr key={row.id}>
          {row.getVisibleCells().map((cell) => {
            const meta: any = cell.column.columnDef.meta;
            console.log(meta)
            return (
              <Td key={cell.id} isNumeric={meta?.isNumeric} isTruncated w={meta?.mw ?? 'fit-content'}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            );
          })}
        </Tr>
      ))}
    </Tbody>
  </ChakraTable>, [table]);

  const addFilter = useCallback((id: string, value: unknown) => {
    setColumnFilters([{ id, value }, ...columnFilters.filter((c) => c.id !== id)]);
  }, [columnFilters]);

  const removeFilter = useCallback((id: string) => {
    setColumnFilters([...columnFilters.filter((c) => c.id !== id)]);
  }, [columnFilters]);
  const rowCount = useCallback(() => data.length, [data.length]);
  const filteredRowCount = useCallback(() => table.getRowCount(), [table]);

  return {
    makeCsvData,
    addFilter,
    removeFilter,
    renderTable,
    rowCount,
    filteredRowCount,
    pageIndex: pagination.pageIndex,
    pageCount: table.getPageCount,
    canNextPage: table.getCanNextPage,
    canPreviousPage: table.getCanPreviousPage,
    nextPage: table.nextPage,
    previousPage: table.previousPage,
  }
}