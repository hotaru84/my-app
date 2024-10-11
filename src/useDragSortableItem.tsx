import { useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { BoxProps } from "@chakra-ui/react";

interface ItemProps {
  itemProps: BoxProps;
}
export function useDragSortableItem(id: string): ItemProps {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const itemProps = useMemo(
    () => ({
      id: id.toString(),
      ref: setNodeRef,
      ...attributes,
      ...listeners,
      style: {
        transform: CSS.Transform.toString(transform),
        transition,
      },
    }),
    [attributes, id, isDragging, listeners, setNodeRef, transform, transition]
  );

  return {
    itemProps,
  };
}
