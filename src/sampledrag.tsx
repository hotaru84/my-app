import {
  Box,
  Center,
  Container,
  Icon,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FC, useState } from "react";
import {
  createSnapModifier,
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { TbRotateDot } from "react-icons/tb";

interface Props {
  children?: React.ReactNode;
  x: number;
  y: number;
}
const Draggable: FC<Props> = ({ children, x, y }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        touchAction: "none",
      }}
      {...listeners}
      {...attributes}
      bottom={y}
      right={x}
      position={"fixed"}
    >
      {children}
    </Box>
  );
};

export const SampleDraggable = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {}),
    useSensor(TouchSensor)
  );
  const pulse = keyframes({
    "0%": {
      transform: "rotate(0deg) scale(1)",
    },
    "100%": {
      transform: "rotate(-360deg) scale(1.0)",
    },
  });

  return (
    <Container size="xl">
      <DndContext
        sensors={sensors}
        onDragEnd={({ delta }) => {
          setCoordinates(({ x, y }) => {
            return {
              x: x - delta.x,
              y: y - delta.y,
            };
          });
        }}
        modifiers={[restrictToWindowEdges]}
      >
        <Draggable x={x} y={y}>
          <Center
            boxSize={30}
            boxShadow={"lg"}
            onClick={onToggle}
            bgColor={isOpen ? "teal.300" : "cyan.200"}
          >
            <Icon
              animation={`${pulse} 2s infinite linear`}
              as={TbRotateDot}
              alignSelf={"center"}
              justifySelf={"center"}
            />
          </Center>
        </Draggable>
      </DndContext>
    </Container>
  );
};
