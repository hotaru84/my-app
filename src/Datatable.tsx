import { FC, useMemo } from "react";
import {
  Button,
  Card,
  CardFooter,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  TableContainer,
  Tag,
  VStack,
  ButtonGroup,
  Flex,
  Box,
  Icon,
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
      filterFn: (row, id, values) => values.length === 0 || values.findIndex((v: string) => v === row.getValue(id)) >= 0,
    }),
    columnHelper.accessor("data1", {
      cell: (info) => info.getValue(),
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
    rowCount,
    filteredRowCount,
    pageIndex,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage
  } = useDataTable<DataSample>(columns, sample, 10);

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
      <Flex mx="auto" gap={2}>
        <InputGroup size='md' flex="1">
          <Input placeholder="Search data2..."
            focusBorderColor="cyan.400"
            onChange={(v) => {
              addFilter('data2', v.target.value);
            }}
          />
          <InputRightElement>
            <Icon as={TbSearch} />
          </InputRightElement>
        </InputGroup>
        <Box flex="1" h={30}>
          <Select
            options={results.map((r) => ({ value: r, label: r }))}
            onChange={(v) => { addFilter('result', v?.map((d) => d.value)) }}
            isMulti
            useBasicStyles
            placeholder={'Select result..'}
          />
        </Box>
        <Tag>{filteredRowCount()}</Tag>
      </Flex>
    </Navigation>
    <Card w="90%" h="90%" borderRadius={16}>
      <ButtonGroup isAttached variant={'ghost'} m={2}>
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
      <TableContainer w="full" overflowX={'auto'} overflowY={"auto"}>
        {renderTable()}
      </TableContainer>
      <CardFooter>
        <Button leftIcon={<TbDownload />} onClick={download}>
          Download
        </Button>
      </CardFooter>
    </Card>
  </VStack >;
};

export default Datatable;
