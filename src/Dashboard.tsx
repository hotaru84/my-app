import { FC, useState } from "react";
import {
  Card,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Tag,
  Box,
  chakra,
  TagLeftIcon,
  ScaleFade,
  SlideFade,
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";
import { Navigation } from "./Navigation";
import { format } from "date-fns";
import TrendlineChart from "./TrendlineChart";
import { AnimatePresence, motion } from "framer-motion";
import { TimeRangeTag } from "./TimeRangeTag";

const stats: StatData[] = [
  {
    label: "Throughput",
    score: 12345,
    icon: TbPackage,
    color: "blue.300",
    unit: "num",
  },
  {
    label: "Success",
    score: 92.4,
    icon: TbCheck,
    color: "green.300",
    unit: "%",
  },
  {
    label: "Error",
    score: 0,
    icon: TbExclamationCircle,
    color: "yellow.300",
    unit: "min",
  },
];

const Dashboad: FC = () => {
  const [timescale, setTimescale] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const ratio = { base: 1, sm: 1.6, md: 2, lg: 3 };

  return (
    <VStack w="full" gap={0}>
      <Navigation >
        <HStack gap={2} borderWidth={1} p={2} borderRadius={8} mx="auto">
          <Tag colorScheme={"green"} w="fit-content">
            <TagLeftIcon as={TbCheck} />
            Ready
          </Tag>
          <Box w="30vw" h="20px">
            <TrendlineChart />
          </Box>
          <Tag colorScheme={"gray"}>
            123
            <chakra.span textColor={"gray"} fontSize={"0.5rem"} ml={1}>
              pkg/min
            </chakra.span>
          </Tag>
        </HStack>
      </Navigation>
      <VStack w="full" overflowY={"auto"} gap={4} p={4} pt={0} overflow={"auto"}>
        <SimpleGrid columns={3} w="full" justifyContent={"space-around"} gap={4} >
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </SimpleGrid>
        <SimpleGrid columns={1} w="full" justifyContent={"space-around"} gap={4} >
          <Card
            rounded={16}
            p={4}
            aspectRatio={ratio}
          >
            <BarLineTimeChart ratio={ratio} onChangeTimescale={setTimescale} isActive={timescale.includes(undefined)} />
          </Card>
        </SimpleGrid>
        <SimpleGrid columns={2} w="full" justifyContent={"space-around"} gap={4} >
          <Card
            rounded={16}
            p={4}
            gap={2}
            aspectRatio={2}
          >
            <TimeRangeTag min={timescale[0]} max={timescale[1]} />
            {[1, 2, 3].map((i) => (
              <Card variant={"outline"} key={i} boxShadow={0}>
                <HStack gap={2} m={2}>
                  <Skeleton aspectRatio={2} speed={3} />
                  <IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../gallery" />
                </HStack>
              </Card>))}
          </Card>
          <Card
            rounded={16}
            p={4}
            aspectRatio={2}
          >
            <TimeRangeTag min={timescale[0]} max={timescale[1]} />
            <TableContainer overflowY={"auto"}>
              <Table variant='simple'>
                <Thead position={"sticky"} top={0}>
                  <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                  </Tr>
                </Thead>
                <Tbody >
                  <Tr>
                    <Td>inches</Td>
                    <Td>millimetres (mm)</Td>
                    <Td isNumeric>25.4</Td>
                  </Tr>
                  <Tr>
                    <Td>feet</Td>
                    <Td>centimetres (cm)</Td>
                    <Td isNumeric>30.48</Td>
                  </Tr>
                  <Tr>
                    <Td>yards</Td>
                    <Td>metres (m)</Td>
                    <Td isNumeric>0.91444</Td>
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </Card>
        </SimpleGrid>
      </VStack>
    </VStack>
  );
};

export default Dashboad;
