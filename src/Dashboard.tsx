import { FC, useMemo } from "react";
import {
  AspectRatio,
  Box,
  Card,
  Flex,
  HStack,
  Spacer,
  Tag,
  TagLeftIcon,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import TrendlineChart from "./TrendlineChart";
import { Layer, Line, Rect, Stage, Image } from "react-konva";
import { useMeasure } from "react-use";
import useImage from "use-image";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import BarLineTimeChart from "./BarLineTimeChart";

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
type Point = {
  x: number;
  y: number;
};

function polygonSort(origin: Point[]): Point[] {
  const center = origin.reduce(
    (center, now) => ({ x: center.x + now.x, y: center.y + now.y }),
    { x: 0, y: 0 }
  );

  return origin
    .map((p) => ({
      ...p,
      angle: Math.atan2(
        p.y - center.y / origin.length,
        p.x - center.x / origin.length
      ),
    }))
    .sort((a, b) => (a.angle > b.angle ? 1 : -1));
}

const Dashboad: FC = () => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const origin = [
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
    { x: Math.random() * 100, y: Math.random() * 100 },
  ];

  return (
    <VStack w="full" h="full">
      <Flex w="full" align={"center"} justify={"center"} p={2} gap={4}>
        <Spacer/>
        <Tag colorScheme={"green"}>
            <TagLeftIcon as={TbCheck} />
            Ready
          </Tag>
        <HStack gap={2} borderWidth={1} p={2} borderRadius={8} mx="auto">
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
        <Spacer />
        <DateTimeRangePicker />
      </Flex>
      <Flex
        gap={4}
        px={8}
        pb={4}
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
          <AspectRatio ref={ref} ratio={4} w="full">
            <BarLineTimeChart/>
          </AspectRatio>
        </Card>
      </Flex>
    </VStack>
  );
};

export default Dashboad;
