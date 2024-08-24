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
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";
import { Navigation } from "./Navigation";
import { format } from "date-fns";

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
  const [selectTime, setSelectTime] = useState(0);
  const ratio = { base: 1, sm: 2, md: 3, lg: 4 };


  return (
    <VStack w="full" gap={0}>
      <Navigation />
      <VStack w="full" overflowY={"auto"} gap={4} p={4} pt={0}>
        <SimpleGrid columns={3} w="full" justifyContent={"space-around"} gap={4}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </SimpleGrid>
        <SimpleGrid columns={1} w="full" justifyContent={"space-around"} gap={4}>
          <Card
            rounded={16}
            p={4}
            aspectRatio={ratio}
          >
            <BarLineTimeChart activeTime={selectTime} setActiveTime={setSelectTime} ratio={ratio} />
          </Card>
        </SimpleGrid>
        <SimpleGrid columns={2} w="full" justifyContent={"space-around"} gap={4}>
          <Card
            rounded={16}
            p={4}
            gap={2}
            aspectRatio={2}
          >
            {selectTime > 0 && <Tag textColor={'#ff6384'}>{format(selectTime, "yyyy/MM/dd hh:mm:ss")}</Tag>}
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
            {selectTime > 0 && <Tag textColor={'#ff6384'}>{format(selectTime, "yyyy/MM/dd hh:mm:ss")}</Tag>}
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
