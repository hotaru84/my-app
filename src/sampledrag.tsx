import { Box, Container } from "@chakra-ui/react";
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
  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {}),
    useSensor(TouchSensor)
  );

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
        modifiers={[restrictToHorizontalAxis]}
      >
        <Draggable x={x} y={y}>
          <Box boxSize={30} boxShadow={"lg"} bgColor={"white"}></Box>
        </Draggable>
      </DndContext>
    </Container>
  );
};
