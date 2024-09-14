import { useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { BoxProps, IconProps } from "@chakra-ui/react";

interface ItemProps {
  itemProps: BoxProps;
  handleProps: BoxProps;
}
export function useDragSortableItemWithHandle(id: string): ItemProps {
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
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 1 : 0,
        boxShadow: isDragging
          ? '0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
          : undefined,
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
      focusBorderWidth: 0,
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [attributes, isDragging, listeners, setDraggableNodeRef]
  );

  return {
    itemProps,
    handleProps,
  };
}
