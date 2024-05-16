import { FC } from "react";
import {
  Box,
  Card,
  Flex,
  HStack,
  Select,
  Spacer,
  Stat,
  StatHelpText,
  StatNumber,
  Tag,
  TagLeftIcon,
  VStack,
} from "@chakra-ui/react";
import { TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import TrendlineChart from "./TrendlineChart";
import { Device } from "./Device";

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
  return (
    <VStack w="full">
      <Flex w="full" p={4} gap={4} align={"center"}>
        <HStack
          gap={4}
          borderWidth={1}
          px={4}
          borderRadius={8}
          mx="auto"
          overflowX={"auto"}
        >
          <Tag colorScheme={"green"} w="full">
            <TagLeftIcon as={TbCheck} />
            Ready
          </Tag>
          <Box w="480px" h="40px">
            <TrendlineChart />
          </Box>
          <Stat textAlign={"end"}>
            <StatNumber>123</StatNumber>
            <StatHelpText>num/min</StatHelpText>
          </Stat>
        </HStack>
        <Spacer />
        <Select variant={"outline"} w="fit-content">
          <option>Month</option>
        </Select>
      </Flex>
      <Flex
        gap={4}
        p={4}
        w="full"
        justify={"center"}
        overflow={"auto"}
        flexWrap={"wrap"}
        alignItems={"center"}
        wrap={"wrap"}
      >
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
        <Card
          rounded={16}
          p={4}
          boxShadow={"lg"}
          w="full"
          h="55vh"
          minH="300px"
        ></Card>
      </Flex>
    </VStack>
  );
};

export default Dashboad;
