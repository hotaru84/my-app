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

interface Props {
  children: React.ReactNode;
  ids: string[];
  setIds: (ids: string[]) => void;
}
export const DragSortableContext: FC<Props> = ({ children, ids, setIds }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log(active, over);
    if (active === undefined || over === null) return;
    if (active.id !== over.id) {
      const oldIndex = ids.findIndex((i) => active?.id === i);
      const newIndex = ids.findIndex((i) => over?.id === i);
      setIds(arrayMove(ids, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={ids}>{children}</SortableContext>
    </DndContext>
  );
};
