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
import { FC } from "react";

export interface SortableItem {
  id: string;
}

interface Props {
  children: React.ReactNode;
  items: SortableItem[];
  setItems: (items: SortableItem[]) => void;
}
export const DragSortableContext: FC<Props> = ({
  children,
  items,
  setItems,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active === undefined || over === null) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => active?.id === i.id);
      const newIndex = items.findIndex((i) => over?.id === i.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={items}>{children}</SortableContext>
    </DndContext>
  );
};
