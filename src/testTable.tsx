import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tag,
  Box,
  HStack,
  IconButton,
  ButtonGroup,
  Spacer,
  Button,
  TableCaption,
  Tfoot,
  Checkbox,
} from "@chakra-ui/react";
import { FC, useCallback, useMemo } from "react";
import {
  TbArrowDown,
  TbArrowUp,
  TbDotsVertical,
  TbTrash,
} from "react-icons/tb";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

type DataResult = {
  lasttime: number;
  type: string;
  data: string;
  speed: number;
  count: number;
};
const results: DataResult[] = [
  {
    lasttime: 1,
    type: "A",
    data: "data_a",
    speed: 10,
    count: 10,
  },
  {
    lasttime: 2,
    type: "AA",
    data: "data_aa",
    speed: 10,
    count: 10,
  },
  {
    lasttime: 3,
    type: "B",
    data: "data_b",
    speed: 11,
    count: 9,
  },
  {
    lasttime: 4,
    type: "C",
    data: "data_c",
    speed: 8,
    count: 15,
  },
  {
    lasttime: 5,
    type: "D",
    data: "data_d",
    speed: 20,
    count: 40,
  },
  {
    lasttime: 6,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 7,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 8,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 9,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 10,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 11,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 12,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
  {
    lasttime: 13,
    type: "E",
    data: "data_e",
    speed: 10,
    count: 16,
  },
];
const columnHelper = createColumnHelper<DataResult>();

const columns = [
  columnHelper.accessor("lasttime", {
    cell: (info) => info.getValue(),
    header: "last time",
  }),
  columnHelper.accessor("type", {
    cell: (info) => <Tag> {info.getValue()}</Tag>,
    header: "Type",
  }),
  columnHelper.accessor("data", {
    cell: (info) => info.getValue(),
    header: "Data",
  }),
  columnHelper.accessor("speed", {
    cell: (info) => info.getValue(),
    header: "Speed",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("count", {
    cell: (info) => info.getValue(),
    header: "Count",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.display({
    id: "action",
    cell: ({ row }) => (
      <IconButton
        variant="ghost"
        icon={<TbDotsVertical />}
        size={"sm"}
        aria-label={""}
      />
    ),
    meta: {
      isNumeric: true,
    },
  }),
];

export const TestTable: FC = () => {
  const table = useReactTable<DataResult>({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.lasttime.toString(),
    initialState: {
      sorting: [{ id: "lasttime", desc: true }],
    },
    enableMultiRowSelection: true,
  });
  const isCheckboxActive = useCallback(() => {
    return table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
  }, [table]);

  return (
    <Table size="sm">
      <Thead
        boxShadow="sm"
        bgColor={"white"}
        borderTopRadius={8}
        position="sticky"
        top={0}
        zIndex="docked"
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {isCheckboxActive() && (
              <Th width="10px">
                <Checkbox
                  isChecked={table.getIsAllRowsSelected()}
                  isIndeterminate={table.getIsSomeRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                ></Checkbox>
              </Th>
            )}
            {headerGroup.headers.map((header) => {
              const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                >
                  <HStack>
                    <Text>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Text>
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TbArrowDown aria-label="sorted descending" />
                      ) : (
                        <TbArrowUp aria-label="sorted ascending" />
                      )
                    ) : null}
                  </HStack>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id} onClick={row.getToggleSelectedHandler()}>
            {isCheckboxActive() && (
              <Td width="10px">
                <Checkbox
                  isChecked={row.getIsSelected()}
                  onClick={row.getToggleSelectedHandler()}
                ></Checkbox>
              </Td>
            )}
            {row.getVisibleCells().map((cell) => {
              const meta: any = cell.column.columnDef.meta;
              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
