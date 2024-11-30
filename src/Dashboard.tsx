import { FC } from "react";
import {
  Card,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  VStack,
  Tag,
  TagLabel,
  Spacer,
  CircularProgress,
  Box,
  ButtonGroup,
  Wrap,
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";
import { Navigation } from "./Navigation";
import { addDays, startOfToday } from "date-fns";
import { useTimelineStats } from "./useTimelineStats";
import Datacard from "./Datacard";
import { Droppable } from "./Droppable";
import { DndContext } from "@dnd-kit/core";
import EditableCardList, { EditableCardInfo } from "./EditableLayout/EditableCardList";
import { TimeRangeTag } from "./TimeRangeTag";

const stats: StatData[] = [
  {
    id: 'a',
    label: "Throughput",
    score: 12345,
    icon: TbPackage,
    color: "blue.300",
    unit: "num",
  },
  {
    id: 'b',
    label: "Success",
    score: 92.4,
    icon: TbCheck,
    color: "green.300",
    unit: "%",
  },
  {
    id: 'c',
    label: "Error",
    score: 0,
    icon: TbExclamationCircle,
    color: "yellow.300",
    unit: "min",
  },
];

const Dashboad: FC = () => {
  const timeline = useTimelineStats({ start: startOfToday(), end: addDays(startOfToday(), 7), slot: 7 });

  const cards: EditableCardInfo[] = [
    ...stats.map((s, i) => ({
      key: 'stats' + i.toString(),
      w: 4,
      h: 1,
      body: <StatCard {...s} />
    })),
    {
      key: 'timeline',
      w: 12,
      h: 2,
      body: <VStack w="full" h="full" p={4} gap={0} align={"start"}>
        <ButtonGroup colorScheme="orange" variant={'ghost'}>
          <TimeRangeTag
            min={timeline.scale.start}
            max={timeline.scale.end}
            isZoom={timeline.isZoomed}
            onClick={timeline.resetScale}
          />
        </ButtonGroup>
        <BarLineTimeChart timeline={timeline} />
      </VStack>
    },
    {
      key: 'gallery',
      w: 6,
      h: 1,
      body: <SimpleGrid w="full" p={4} columns={3} gap={2}>{[1, 2, 3].map((i) => (
        <Card variant={"outline"} key={'dqel' + i} boxShadow={0} w="full">
          <Skeleton aspectRatio={2} speed={3} w="full" />
          <IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../gallery" />
        </Card>))}</SimpleGrid>
    },
    {
      key: 'datatable',
      w: 6,
      h: 3,
      body: <Datacard />
    }
  ];

  return (
    <VStack w="full" gap={0}>
      <Navigation >
        <>
          <HStack gap={1} >
            {[...Array(5)].map((_, j) => (
              <Tag colorScheme={"green"} w="fit-content" key={'tag' + j} gap={2}>
                <CircularProgress size={4} value={100 * Math.random()} color="green.400" thickness={8}>
                </CircularProgress>
                <TagLabel>unit </TagLabel>
              </Tag>
            ))}
          </HStack>
          <Spacer />
        </>
      </Navigation>
      <Box w="full" h="full">
        <EditableCardList lsId={"dashboard"} cards={cards} />
      </Box>
    </VStack>
  );
};

export default Dashboad;
