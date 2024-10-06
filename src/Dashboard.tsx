import { FC } from "react";
import {
  Card,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  VStack,
  Tag,
  Box,
  chakra,
  TagLeftIcon,
  Avatar,
  TagLabel,
  Spinner,
  Spacer,
  Progress,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";
import { Navigation } from "./Navigation";
import { addDays, startOfToday } from "date-fns";
import TrendlineChart from "./TrendlineChart";
import { useTimelineStats } from "./useTimelineStats";
import Datacard from "./Datacard";
import { Sparklines } from "react-sparklines";

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
  const timeline = useTimelineStats({ start: startOfToday(), end: addDays(startOfToday(), 7), slot: 7 });
  const ratio = { base: 1, sm: 1.6, md: 3, lg: 3.5 };

  return (
    <VStack w="full" gap={0}>
      <Navigation >
        <>
          <HStack gap={1} >
            {[...Array(5)].map((_, j) => (
              <Tag colorScheme={"green"} w="fit-content" key={j} gap={2}>
                <CircularProgress size={4} value={100 * Math.random()} color="green.400" thickness={8}>
                </CircularProgress>
                <TagLabel>unit </TagLabel>
              </Tag>
            ))}
          </HStack>
          <Spacer />
        </>
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
            <BarLineTimeChart ratio={ratio} timeline={timeline} />
          </Card>
        </SimpleGrid>
        <SimpleGrid
          columns={2}
          w="full"
          justifyContent={"space-around"}
          gap={4}
        >
          <Card
            rounded={16}
            p={4}
            gap={2}
          >
            {[1, 2, 3].map((i) => (
              <Card variant={"outline"} key={i} boxShadow={0}>
                <HStack gap={2} m={2}>
                  <Skeleton aspectRatio={2} speed={3} />
                  <IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../gallery" />
                </HStack>
              </Card>))}
          </Card>
          <Datacard />
        </SimpleGrid>
      </VStack>
    </VStack>
  );
};

export default Dashboad;
