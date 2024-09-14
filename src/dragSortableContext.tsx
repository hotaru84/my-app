import { Box } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { FC, useState } from "react";

interface Props {
  children: React.ReactNode;
  ids: string[];
  setIds: (ids: string[]) => void;
}
export const DragSortableContext: FC<Props> = ({ children, ids, setIds }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active === undefined || over === null) return;
    if (active.id !== over.id) {
      const oldIndex = ids.findIndex((i) => active?.id === i);
      const newIndex = ids.findIndex((i) => over?.id === i);
      setIds(arrayMove(ids, oldIndex, newIndex));
    }
    setActiveId(null);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={ids}>{children}</SortableContext>
    </DndContext>
  );
};
