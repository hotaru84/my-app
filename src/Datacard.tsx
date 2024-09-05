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
  Tooltip,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { TbArrowLeft, TbArrowRight, TbDownload, TbSearch } from "react-icons/tb";
import { createColumnHelper } from "@tanstack/react-table";
import { addHours, format } from "date-fns";
import { Select } from "chakra-react-select";
import { useDataTable } from "./useDataTable";
import { motion } from "framer-motion";

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
  data1: number;
  data2: string;
  data3: string;
  data4: number;
};

const Datacard: FC = () => {
  const columnHelper = createColumnHelper<DataSample>();
  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      cell: (info) => <IconButton icon={<TbArrowRight />} aria-label={""} variant={'ghost'} as={motion.div} whileHover={{ scale: 1.1, borderWidth: 2 }} rounded='full' />,
      header: "id",
    }),
    columnHelper.accessor("date", {
      cell: (info) => format(info.getValue(), "PP p"),
      header: "date time",
      meta: {
        mw: '30vw'
      }
    }),
    columnHelper.accessor("result", {
      cell: (info) => {
        const color = info.getValue() === "success" ? "green" : info.getValue() === "warning" ? "yellow" : "red";
        return <Tag colorScheme={color}>{String(info.getValue())}</Tag>;
      },
      header: "result",
      filterFn: (row, id, values) => values.length === 0 || values.findIndex((v: string) => v === row.getValue(id)) >= 0,
    }),
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "id",
    }),
  ], [columnHelper]);

  const sample: DataSample[] = useMemo(() => [...Array(100)].map((_, i) => ({
    id: i,
    date: addHours(new Date(), i + Math.random() * 10),
    result: Math.random() > 0.5 ? 'success' : Math.random() > 0.5 ? 'warning' : 'error',
    data1: Math.random(),
    data2: Math.random().toString(32).substring(2) + i,
    data3: Math.random().toString(32).substring(2),
    data4: Math.random() * 100
  })), []);

  const {
    renderTable,
    pageIndex,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage
  } = useDataTable<DataSample>(columns, sample, 10);


  return <Card
    rounded={16}
    p={4}
    h={"30vh"}
  >
    <TableContainer overflowX={'auto'} overflowY={"auto"}>
      {renderTable()}
    </TableContainer>
    <ButtonGroup isAttached variant={'ghost'} size="sm">
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
  </Card>;
};

export default Datacard;
