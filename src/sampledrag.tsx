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
      top={y}
      left={x}
      position={"absolute"}
    >
      {children}
    </Box>
  );
};
const Droppable: FC<Props> = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <Box ref={setNodeRef} style={style}>
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
              x: x + delta.x,
              y: y + delta.y,
            };
          });
        }}
      >
        <Draggable x={x} y={y}>
          <Box boxSize={30} boxShadow={"lg"}></Box>
        </Draggable>
      </DndContext>
    </Container>
  );
};
