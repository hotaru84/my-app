import {
  Text,
  IconButton,
  ButtonGroup,
  Card,
  StatLabel,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  useDisclosure,
  VStack,
  Wrap,
  useBreakpointValue,
} from "@chakra-ui/react";
import { TbDiabolo, TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useState } from "react";
import { Device } from "./Device";
import AddNewDialog from "./AddNewDialog";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

const INITIAL_ITEMS = [
  { id: "0" },
  { id: "1" },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
  { id: "7" },
  { id: "8" },
  { id: "9" },
];
export const DeviceTest = () => {
  const [selected, onSelect] = useState("");
  const maxSingleW = 60;
  const baseW = useBreakpointValue({ base: 50, md: 24 }, { ssr: false }) ?? 0;
  const { isOpen: isTable, onToggle: onToggleTable } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [items, setItems] = useState(INITIAL_ITEMS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const overId = over?.id;

    console.log("s" + active.id, overId);

    if (active === undefined || !overId) return;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => active?.id === i.id);
        const newIndex = items.findIndex((i) => over?.id === i.id);
        console.log(oldIndex, newIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  return (
    <Card m={2} borderRadius={16} as={motion.div} layout maxW={"80vw"} p={2}>
      <ButtonGroup colorScheme="blue">
        <IconButton
          icon={<TbTable />}
          aria-label={""}
          onClick={onToggleTable}
        />
        <IconButton icon={<TbDiabolo />} aria-label={""} onClick={onOpen} />
      </ButtonGroup>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={items}>
          <Wrap shouldWrapChildren align={"center"} justify={"center"} gap={4}>
            {items.map((b) => (
              <Device
                key={b.id}
                id={b.id}
                visible={selected === b.id || selected === ""}
                selected={selected === b.id}
                width={selected === b.id ? maxSingleW : baseW}
                landscape={Number(b) % 10 === 0}
                onSelect={() => onSelect(selected === b.id ? "" : b.id)}
              />
            ))}
          </Wrap>
        </SortableContext>
      </DndContext>
      {isTable && (
        <VStack>
          <Stat>
            <StatLabel fontSize={"1rem"}>Throughput</StatLabel>
            <StatNumber fontSize={"3rem"}>
              <StatArrow type="increase" />
              30
              <Text as="span" fontSize={"1rem"} fontWeight={"light"}>
                num/sec
              </Text>
            </StatNumber>
            <StatHelpText>1 data</StatHelpText>
          </Stat>
          <TestTable />
        </VStack>
      )}
      <AddNewDialog isOpen={isOpen} onClose={onClose} />
    </Card>
  );
};
