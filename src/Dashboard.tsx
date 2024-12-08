import { FC, useMemo } from "react";
import {
  HStack,
  IconButton,
  VStack,
  Tag,
  TagLabel,
  Spacer,
  CircularProgress,
  useDisclosure,
  ScaleFade,
} from "@chakra-ui/react";
import { TbEdit } from "react-icons/tb";
import { Navigation } from "./Navigation";
import { endOfMonth, startOfMonth, startOfToday } from "date-fns";
import EditableCardList from "./EditableLayout/EditableCardList";
import { DashboardAddCard } from "./Dashboard/DashboardAddCard";
import { generateSampleData } from "./Dashboard/generateSampleData";
import { Timeframe } from "./Dashboard/SampleData";


const Dashboad: FC = () => {
  const timeframe: Timeframe = useMemo(() => ({
    start: startOfMonth(startOfToday()),
    end: endOfMonth(startOfToday()),
    slot: 30,
  }), []);
  const sampleData = useMemo(() => generateSampleData(timeframe, 100), [timeframe]);
  const { isOpen: isEditable, onToggle: onToggleEditable } = useDisclosure();

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
          <DashboardAddCard />
        </ScaleFade>
        <IconButton
          colorScheme="cyan"
          variant={"ghost"}
          onClick={onToggleEditable}
          isActive={isEditable}
          icon={<TbEdit />} aria-label={""} />
      </Navigation>
      <EditableCardList data={sampleData} isEditable={isEditable} />
    </VStack>
  );
};

export default Dashboad;
