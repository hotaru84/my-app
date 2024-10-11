import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

interface Props {
    children: React.ReactNode;
}
export const Droppable: FC<Props> = ({ children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'droppable',
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
}