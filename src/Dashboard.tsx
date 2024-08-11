import { FC, useMemo } from "react";
import {
  AspectRatio,
  Box,
  Card,
  Flex,
  HStack,
  Select,
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
import { DatePickerPopover } from "./DatePicker";

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
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
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
  const results = polygonSort(origin).flatMap((p) => [p.x, p.y]);
  const [image] = useImage("/sample.svg");
  const aspect = image !== undefined ? image?.width / image?.height : 1;
  console.log(image, aspect, image?.width, image?.height);

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
        <DatePickerPopover />
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
              <Layer>
                <Line
                  points={origin.flatMap((p) => [p.x, p.y])}
                  offset={{ x: 100, y: 100 }}
                  fill="#00D2FF"
                  closed
                />
                <Line points={results} fill="pink" closed />
                <Image image={image} width={100} height={100 / aspect} />
              </Layer>
            </Stage>
          </AspectRatio>
        </Card>
      </Flex>
    </VStack>
  );
};

export default Dashboad;
