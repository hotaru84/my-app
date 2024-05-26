import { FC } from "react";
import {
  AspectRatio,
  Box,
  Card,
  Flex,
  HStack,
  Select,
  Spacer,
  Stat,
  StatHelpText,
  StatNumber,
  Tab,
  TabList,
  Tabs,
  Tag,
  TagLeftIcon,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import TrendlineChart from "./TrendlineChart";
import { Device } from "./Device";
import { Layer, Stage } from "react-konva";
import { useMeasure } from "react-use";
import { NavLink } from "react-router-dom";

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
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();

  return (
    <VStack w="full" h="full">
      <Flex w="full" align={"center"} justify={"center"} p={2}>
        <Spacer />
        <HStack gap={2} borderWidth={1} p={2} borderRadius={8} mx="auto">
          <Tag colorScheme={"green"}>
            <TagLeftIcon as={TbCheck} />
            Ready
          </Tag>
          <Box w="200px" h="20px">
            <TrendlineChart />
          </Box>
          <Tag colorScheme={"gray"}>
            123
            <chakra.span textColor={"gray"} fontSize={"0.5rem"} ml={1}>
              pkg/min
            </chakra.span>
          </Tag>
        </HStack>
        <Spacer />
        <Select variant={"outline"} w="fit-content">
          <option>Month</option>
        </Select>
      </Flex>
      <Flex
        gap={4}
        px={4}
        pb={4}
        maxW="3xl"
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
          h="fit-content"
          minH={`${height}px`}
        >
          <AspectRatio ref={ref} ratio={2.5} w="full">
            <Stage
              width={width}
              height={height}
              style={{
                borderWidth: 1,
                borderColor: "pink",
                borderRadius: 16,
              }}
              draggable
            >
              <Layer></Layer>
            </Stage>
          </AspectRatio>
        </Card>
      </Flex>
    </VStack>
  );
};

export default Dashboad;
