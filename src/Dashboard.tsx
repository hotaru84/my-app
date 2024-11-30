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
  useDisclosure,
  Button,
  ScaleFade,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  layout,
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbEdit, TbExclamationCircle, TbPackage, TbPlus } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";
import { Navigation } from "./Navigation";
import { addDays, startOfToday } from "date-fns";
import { useTimelineStats } from "./useTimelineStats";
import Datacard from "./Datacard";
import EditableCardList, { EditableCardInfo } from "./EditableLayout/EditableCardList";
import { TimeRangeTag } from "./TimeRangeTag";
import { MdClose, MdUndo } from "react-icons/md";
import { useLocalStorage } from "react-use";

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
  const { isOpen: isEditable, onToggle: onToggleEditable } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timeline = useTimelineStats({ start: startOfToday(), end: addDays(startOfToday(), 7), slot: 7 });

  const cards: EditableCardInfo[] = [
    ...stats.map((s, i): EditableCardInfo => ({
      body: <StatCard {...s} />,
      layout: {
        i: 'stats' + i.toString(),
        x: i * 4,
        y: 0,
        w: 4,
        h: 2
      }
    })),
    {
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
      </VStack>,
      layout: {
        i: "timeline",
        x: 0,
        y: 2,
        w: 12,
        h: 7
      }
    },
    {
      body: <SimpleGrid w="full" p={4} columns={3} gap={2}>{[1, 2, 3].map((i) => (
        <Card variant={"outline"} key={'dqel' + i} boxShadow={0} w="full">
          <Skeleton aspectRatio={2} speed={3} w="full" />
          <IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../gallery" />
        </Card>))}</SimpleGrid>,
      layout: {
        i: "gallery",
        x: 0,
        y: 9,
        w: 6,
        h: 4
      }
    },
    {
      body: <Datacard />,
      layout: {
        i: "datatable",
        x: 6,
        y: 9,
        w: 6,
        h: 4
      }
    }
  ];

  return (
    <VStack w="full" h="full" gap={0}>
      <Navigation>
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
        <ScaleFade in={isEditable} unmountOnExit>
          <IconButton
            colorScheme="cyan"
            variant={"ghost"}
            onClick={onOpen}
            icon={<TbPlus />} aria-label={""} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='ghost'>Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ScaleFade>
        <IconButton
          colorScheme="cyan"
          variant={"ghost"}
          onClick={onToggleEditable}
          isActive={isEditable}
          icon={<TbEdit />} aria-label={""} />
      </Navigation>
      <EditableCardList lsId={"dashboard"} cards={cards} isEditable={isEditable} />
    </VStack>
  );
};

export default Dashboad;
