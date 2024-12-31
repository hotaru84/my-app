import { Tr, Tbody, Td, Table as ChakraTable, Text } from "@chakra-ui/react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { format } from "date-fns";
import { ReactElement, useCallback } from "react";

type DataTable = {
  makeCsvData: () => string;
  renderTable: () => ReactElement;
}

export function useDataTable<T>(columns: ColumnDef<T, any>[], data: T[], maxRowInPage?: number): DataTable {
  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
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
    <Tbody>
      {table.getHeaderGroups().map((headerGroup, hgid) => {
        return headerGroup.headers.map((header, hid) => (
          <Tr key={`h-${hid}`}>
            <Td>
              <Text>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </Text>
            </Td>
            {table.getRowModel().rows.map((row, rid) => {
              const cell = row.getVisibleCells().at(hid);
              return cell !== undefined ? <Td key={`c-${hid}-{rid}`}>
                {flexRender(cell?.column.columnDef.cell, cell.getContext())}
              </Td> : <Td></Td>
            })}
          </Tr>
        ));
      }
      )}
    </Tbody>
  </ChakraTable>, [table]);

  return {
    makeCsvData,
    renderTable,
  }
}