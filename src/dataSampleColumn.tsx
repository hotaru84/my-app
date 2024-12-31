import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  Tag,
} from "@chakra-ui/react";

export const Results = [
  "success",
  "error",
  "warning"
];
export type Result = typeof Results[keyof typeof Results];

export type DataSample = {
  id: number;
  date: Date;
  result: Result;
  data1: number;
  data2: string;
  data3: string;
  data4: number;
};
interface DataSampleColumn {
  columns: ColumnDef<DataSample, any>[];
}

export function useDataSampleColumn(): DataSampleColumn {
  const columnHelper = createColumnHelper<DataSample>();

  const columns = useMemo((): ColumnDef<DataSample, any>[] => [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "id",
      filterFn: (row, id, values) => values.length === 0 || String(row.getValue(id)).includes(values),
    }),
    columnHelper.accessor("date", {
      cell: (info) => format(info.getValue(), "PP p"),
      header: "date time",
    }),
    columnHelper.accessor("result", {
      cell: (info) => {
        const color = info.getValue() === "success" ? "green" : info.getValue() === "warning" ? "yellow" : "red";

        return <Tag colorScheme={color}>{String(info.getValue())}</Tag>
      },
      header: "result",
      filterFn: (row, id, values) => values.length === 0 || values.findIndex((v: string) => v === row.getValue(id)) >= 0,
    }),
    columnHelper.accessor("data1", {
      cell: (info) => new Intl.NumberFormat(window.navigator.language).format(info.getValue()),
      header: "data1",
    }),
    columnHelper.accessor("data2", {
      cell: (info) => info.getValue(),
      header: "data2",
    }),
    columnHelper.accessor("data3", {
      cell: (info) => info.getValue(),
      header: "data3",
    }),

    columnHelper.accessor("data4", {
      cell: (info) => info.getValue(),
      header: "data4",
      meta: {
        isNumeric: true,
      }
    })
  ], [columnHelper]);

  return {
    columns
  }
}