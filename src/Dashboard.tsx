import { FC, useMemo, useState } from "react";
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
  NumberInputField,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import { TbEdit } from "react-icons/tb";
import { Navigation } from "./Navigation";
import EditableCardList from "./Dashboard/EditableCardList";
import { DashboardAddCard } from "./Dashboard/DashboardAddCard";
import { NavLink } from "react-router-dom";

const Dashboad: FC = () => {
  const [id, setId] = useState(0);
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
        <NavLink to={`/gallery?id=${id}`}>link</NavLink>
        <NumberInput value={id} onChange={(v) => setId(Number(v))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
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
      <EditableCardList isEditable={isEditable} />
    </VStack>
  );
};

export default Dashboad;
