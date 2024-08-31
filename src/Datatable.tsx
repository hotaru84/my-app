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
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { TbChevronDown, TbChevronUp, TbDownload, TbSearch } from "react-icons/tb";
import { ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { addHours, format } from "date-fns";

type DataSample = {
  id: number;
  date: Date;
  data1: string;
  data2: string;
  data3: string;
  data4: number;
};

const columnHelper = createColumnHelper<DataSample>();

const Datatable: FC = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [search, setSearch] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: true }
  ]);
  const [pageSetting, setPageSetting] = useState({
    pageIndex: 0,
    pageSize: 2
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
    columnHelper.accessor("data1", {
      cell: (info) => info.getValue(),
      header: "data1",
      filterFn: 'includesString'
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
  ], []);

  const sample: DataSample[] = useMemo(() => [...Array(100)].map((_, i) => ({
    id: i,
    date: addHours(new Date(), i + Math.random() * 10),
    data1: 'test',
    data2: 'test' + i,
    data3: 'datea',
    data4: Math.random() * 100
  })), []);
  const table = useReactTable<DataSample>({
    columns,
    data: sample,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    }
  });

  const download = () => {
    const csvheader = table.getHeaderGroups().map((g) => g.headers.map((h) => "#" + h.id)).join(',') + ',\n';
    const csv = table.getRowModel().rows.map(
      (r) => r.getVisibleCells().map((c, i) => i === 1 ? format(c.getValue() as Date, 'PP p') : c.getValue()).join(',')
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
              table?.getColumn("data2")?.setFilterValue(v.target.value);
            }
            } />
          <InputRightElement>
            <IconButton size='sm' aria-label={"search"} icon={<TbSearch />} />
          </InputRightElement>
        </InputGroup>
      </HStack>
    </Navigation>
    <VStack w="full">
      <Card m={4} w="80%" borderRadius={16}>
        <HStack p={4}>
          <Tag>Total 100 data</Tag>
        </HStack>
        <TableContainer w="full" h="70vh" overflowX={'auto'} overflowY={"auto"}>
          <Table variant='simple' >
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
          </Table>
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
