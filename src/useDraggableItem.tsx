import { useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { BoxProps } from "@chakra-ui/react";

interface ItemProps {
  itemProps: BoxProps;
  handleProps: BoxProps;
}
export function useDraggableItem(id: string): ItemProps {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setDraggableNodeRef,
  } = useSortable({ id });

  const itemProps = useMemo(
    () => ({
      id: id.toString(),
      ref: setNodeRef,
      boxShadow: isDragging ? "lg" : "sm",
      style: {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      },
    }),
    [id, isDragging, setNodeRef, transform, transition]
  );

  const handleProps = useMemo(
    () => ({
      ref: setDraggableNodeRef,
      ...attributes,
      ...listeners,
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [attributes, isDragging, listeners, setDraggableNodeRef]
  );

  return {
    itemProps,
    handleProps,
  };
}
