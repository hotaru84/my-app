import { FC, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  chakra,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Table as ChakraTable,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { TbArrowLeft, TbArrowRight, TbChevronDown, TbChevronUp, TbDownload, TbSearch } from "react-icons/tb";
import { ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, Table as ReactTable, useReactTable, FilterFn, PaginationState, getPaginationRowModel } from "@tanstack/react-table";
import { addHours, format } from "date-fns";
import { Select } from "chakra-react-select";

const results = [
  "success",
  "error",
  "warning"
];
type Result = typeof results[keyof typeof results];

type DataSample = {
  id: number;
  date: Date;
  result: Result;
  data1: string;
  data2: string;
  data3: string;
  data4: number;
};

const Table: FC<ReactTable<DataSample>> = (table: ReactTable<DataSample>) => {
  return <ChakraTable variant='simple'>
    <Thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <Tr key={headerGroup.id} position={'sticky'} top={0}>
          {headerGroup.headers.map((header) => {
            const meta: any = header.column.columnDef.meta;
            return (
              <Th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                isNumeric={meta?.isNumeric}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                <chakra.span pl="4">
                  {header.column.getIsSorted() ? (
                    header.column.getIsSorted() === "desc" ? (
                      <Icon as={TbChevronDown} aria-label="sorted descending" />
                    ) : (
                      <Icon as={TbChevronUp} aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            );
          })}
        </Tr>
      ))}
    </Thead>
    <Tbody>
      {table.getRowModel().rows.map((row) => (
        <Tr key={row.id}>
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
  </ChakraTable>;
}

const Datatable: FC = () => {
  const columnHelper = createColumnHelper<DataSample>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // can set initial column filter state here
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "id",
    }),
    columnHelper.accessor("date", {
      cell: (info) => format(info.getValue(), "PP p"),
      header: "date time",
    }),
    columnHelper.accessor("result", {
      cell: (info) => {
        const color = info.getValue() === "success" ? "green" : info.getValue() === "warning" ? "yellow" : "red";
        return <Tag colorScheme={color}>{String(info.getValue())}</Tag>;
      },
      header: "result",
      filterFn: 'arrIncludesSome'
    }),
    columnHelper.accessor("data1", {
      cell: (info) => info.getValue(),
      header: "data1",
    }),
    columnHelper.accessor("data2", {
      cell: (info) => info.getValue(),
      header: "data2",
      filterFn: 'includesString'
    }),
    columnHelper.accessor("data3", {
      cell: (info) => info.getValue(),
      header: "data3",
      filterFn: 'includesString'
    }),

    columnHelper.accessor("data4", {
      cell: (info) => info.getValue(),
      header: "data4",
      filterFn: 'includesString',
      meta: {
        isNumeric: true
      }
    })
  ], [columnHelper]);

  const sample: DataSample[] = useMemo(() => [...Array(100)].map((_, i) => ({
    id: i,
    date: addHours(new Date(), i + Math.random() * 10),
    result: Math.random() > 0.5 ? 'success' : Math.random() > 0.5 ? 'warning' : 'error',
    data1: Math.random().toString(32).substring(2),
    data2: Math.random().toString(32).substring(2) + i,
    data3: Math.random().toString(32).substring(2),
    data4: Math.random() * 100
  })), []);

  const table = useReactTable<DataSample>({
    columns,
    data: sample,
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

  const formatValueForCsv = (v: any) => {
    if (typeof v === 'string') return '"' + v + '"';
    if (Object.prototype.toString.call(v) === "[object Date]") return '"' + format(v, 'PP p') + '"';
    return v;
  }

  const download = () => {
    const csvheader = table.getHeaderGroups().map((g) => g.headers.map((h) => "#" + h.id)).join(',') + ',\n';
    const csv = table.getRowModel().rows.map(
      (r) => r.getVisibleCells().map((c, i) => formatValueForCsv(c.getValue())).join(',')
    ).join(",\n");

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvheader + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.download = "test.csv"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return <VStack w="full" gap={0}>
    <Navigation>
      <HStack mx="auto" justify={"end"}>
        <InputGroup size='md' ml={8}>
          <Input placeholder="Search text..."
            focusBorderColor="cyan.400"
            onChange={(v) => {
              setColumnFilters([
                { id: 'data2', value: v.target.value },
                ...columnFilters.filter((c) => c.id !== 'data2')
              ]);
            }
            } />
          <InputRightElement>
            <IconButton size='sm' aria-label={"search"} icon={<TbSearch />} />
          </InputRightElement>
        </InputGroup>
        {/** multiple selection test */}
        <Select options={results.map((r) => ({ value: r, label: r }))} onChange={
          (v) => {
            if (v !== null) setColumnFilters([
              { id: 'result', value: [v?.value] },
              ...columnFilters.filter((c) => c.id !== 'result')
            ]);
          }
        } />
      </HStack>
    </Navigation>
    <VStack w="full">
      <Card m={4} w="80%" borderRadius={16}>
        <HStack p={4}>
          <ButtonGroup isAttached variant={'ghost'}>
            <IconButton aria-label={"prev"} icon={<TbArrowLeft />} onClick={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()} />
            <Tag colorScheme="white">{pagination.pageIndex + 1} / {table.getPageCount()}</Tag>
            <IconButton aria-label={"prev"} icon={<TbArrowRight />} onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()} />
          </ButtonGroup>
        </HStack>
        <TableContainer w="full" h="70vh" overflowX={'auto'} overflowY={"auto"}>
          <Table {...table} />
        </TableContainer>
        <CardFooter>

          <Button leftIcon={<TbDownload />} onClick={download}>
            Download
          </Button>
        </CardFooter>
      </Card>
    </VStack>
  </VStack >;
};

export default Datatable;
