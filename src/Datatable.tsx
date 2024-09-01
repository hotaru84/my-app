import { FC, useMemo } from "react";
import {
  Button,
  Card,
  CardFooter,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  TableContainer,
  Tag,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { TbArrowLeft, TbArrowRight, TbDownload, TbSearch } from "react-icons/tb";
import { createColumnHelper } from "@tanstack/react-table";
import { addHours, format } from "date-fns";
import { Select } from "chakra-react-select";
import { useDataTable } from "./useDataTable";

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

const Datatable: FC = () => {
  const columnHelper = createColumnHelper<DataSample>();
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

  const {
    renderTable,
    makeCsvData,
    addFilter,
    pageIndex,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage
  } = useDataTable<DataSample>(columns, sample, 100);

  const download = () => {
    const csv = makeCsvData();
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.download = "test.csv"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <VStack w="full" gap={0}>
    <Navigation>
      <HStack mx="auto" justify={"end"}>
        <InputGroup size='md' ml={8}>
          <Input placeholder="Search text..."
            focusBorderColor="cyan.400"
            onChange={(v) => {
              addFilter('data2', v.target.value);
            }
            } />
          <InputRightElement>
            <IconButton size='sm' aria-label={"search"} icon={<TbSearch />} />
          </InputRightElement>
        </InputGroup>
        {/** multiple selection test */}
        <Select options={results.map((r) => ({ value: r, label: r }))} onChange={
          (v) => {
            addFilter('result', [v?.value]);
          }
        } />
      </HStack>
    </Navigation>
    <VStack w="full">
      <Card m={4} w="80%" borderRadius={16}>
        <HStack p={4}>
          <ButtonGroup isAttached variant={'ghost'}>
            <IconButton aria-label={"prev"}
              icon={<TbArrowLeft />}
              onClick={previousPage}
              isDisabled={!canPreviousPage()}
            />
            <Tag colorScheme="white">{pageIndex + 1} / {pageCount()}</Tag>
            <IconButton aria-label={"prev"}
              icon={<TbArrowRight />}
              onClick={nextPage}
              isDisabled={!canNextPage()} />
          </ButtonGroup>
        </HStack>
        <TableContainer w="full" h="70vh" overflowX={'auto'} overflowY={"auto"}>
          {renderTable()}
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
