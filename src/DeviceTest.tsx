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
  Button,
  Box,
} from "@chakra-ui/react";
import { TbDragDrop2, TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useState } from "react";
import { Device } from "./Device";
import AddNewDialog from "./AddNewDialog";
import { DragSortableContext } from "./dragSortableContext";
import { CSS } from "@dnd-kit/utilities";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { SampleDraggable } from "./sampledrag";

const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "second" },
  { id: "2", title: "second" },
  { id: "3", title: "second" },
  { id: "4", title: "second" },
  { id: "5", title: "second" },
  { id: "6", title: "second" },
  { id: "7", title: "second" },
  { id: "8", title: "second" },
  { id: "9", title: "second" },
];
export const DeviceTest = () => {
  const [selected, onSelect] = useState("");
  const maxSingleW = 60;
  const baseW = useBreakpointValue({ base: 50, md: 24 }, { ssr: false }) ?? 0;
  const { isOpen: isTable, onToggle: onToggleTable } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ids, setIds] = useState<string[]>(Items.map((i) => i.id));

  return (
    <Card m={2} borderRadius={16} as={motion.div} layout maxW={"80vw"} p={2}>
      <ButtonGroup colorScheme="blue">
        <IconButton
          icon={<TbTable />}
          aria-label={""}
          onClick={onToggleTable}
        />
        <IconButton icon={<TbDragDrop2 />} aria-label={""} onClick={onOpen} />
      </ButtonGroup>
      <DragSortableContext ids={ids} setIds={setIds}>
        <Wrap shouldWrapChildren align={"center"} justify={"center"} gap={4}>
          {ids.map((id) => {
            const item = Items.find((i) => i.id === id);
            const isSelected = selected === item?.id;
            if (item === undefined) return <></>;
            return (
              <Device
                key={item.id}
                id={item.id}
                visible={isSelected || selected === ""}
                selected={isSelected}
                width={isSelected ? maxSingleW : baseW}
                landscape={true}
                onSelect={() => onSelect(isSelected ? "" : item.id)}
              />
            );
          })}
        </Wrap>
      </DragSortableContext>
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
      <SampleDraggable />
      <AddNewDialog isOpen={isOpen} onClose={onClose} />
    </Card>
  );
};
