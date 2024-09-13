import { useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { BoxProps, IconProps } from "@chakra-ui/react";

interface ItemProps {
  itemProps: BoxProps;
  handleProps: IconProps;
}
export function useDragSortableItem(id: string): ItemProps {
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
      style: {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      },
    }),
    [id, setNodeRef, transform, transition]
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
