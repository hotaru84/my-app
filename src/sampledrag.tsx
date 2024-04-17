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
  rectIntersection,
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
import { TbAlertOctagon, TbRotateDot } from "react-icons/tb";

interface Props {
  children?: React.ReactNode;
  x: number;
  y: number;
  id: string;
}
const Draggable: FC<Props> = ({ children, x, y, id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
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
  const [{ x1, y1 }, setCoordinates1] = useState({ x1: 10, y1: 10 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {}),
    useSensor(TouchSensor)
  );
  const shake = keyframes({
    "10%, 90%": {
      transform: "translate3d(0,-0px, 0)",
    },
    "20%, 80%": {
      transform: "translate3d(0,1px, 0)",
    },
    "30%, 50%, 70%": {
      transform: "translate3d(0,-1px, 0)",
    },
    "40%, 60%": {
      transform: "translate3d(0,1px, 0)",
    },
  });
  const rotate = keyframes({
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
        onDragEnd={({ delta, active }) => {
          if (active.id === "drg-1") {
            setCoordinates(({ x, y }) => {
              return {
                x: x - delta.x,
                y: y - delta.y,
              };
            });
          } else {
            setCoordinates1(({ x1, y1 }) => {
              return {
                x1: x1 - delta.x,
                y1: y1 - delta.y,
              };
            });
          }
        }}
        modifiers={[restrictToWindowEdges]}
      >
        <Draggable x={x} y={y} id="drg-1">
          <Center
            boxSize={30}
            boxShadow={"lg"}
            onClick={onToggle}
            bgColor={isOpen ? "teal.300" : "cyan.200"}
          >
            <Icon
              animation={`${shake} 2s infinite ease`}
              as={TbAlertOctagon}
              alignSelf={"center"}
              justifySelf={"center"}
            />
          </Center>
        </Draggable>
        <Draggable x={x1} y={y1} id="drg-2">
          <Center
            boxSize={30}
            boxShadow={"lg"}
            onClick={onToggle}
            bgColor={isOpen ? "teal.300" : "cyan.200"}
          >
            <Icon
              animation={`${rotate} 2s infinite linear`}
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
