import { Box, Tag } from "@chakra-ui/react";
import { FC, useCallback, useMemo, useRef } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import { Layer, Stage, Image } from "react-konva";
import useImage from "use-image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  visible: boolean;
  selected: boolean;
  width: number;
  landscape: boolean;
  onSelect: () => void;
}
export const Device: FC<Props> = ({
  id,
  visible,
  selected,
  width,
  landscape,
  onSelect,
}) => {
  const ref = useRef(null);
  const [image] = useImage("");
  const boxSize = useSize(ref);
  const ratio = 2;
  const getStageSize = useCallback(() => {
    if (boxSize === undefined) return { width: 0, height: 0 };
    return {
      width: boxSize.width,
      height: boxSize.height,
    };
  }, [boxSize]);
  const getImageSize = useCallback(() => {
    if (boxSize === undefined) return { width: 0, height: 0 };
    return {
      width: landscape ? boxSize.width : boxSize.height,
      height: landscape ? boxSize.height : boxSize.width,
    };
  }, [boxSize, landscape]);

  const getOffset = useCallback(() => {
    if (boxSize === undefined || landscape) return { x: 0, y: 0 };
    return {
      x: 0,
      y: boxSize.height,
    };
  }, [boxSize, landscape]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setDraggableNodeRef,
  } = useSortable({ id });

  const draggableItemStyle = useMemo(
    () => ({
      id: id.toString(),
      ref: setNodeRef,
      boxShadow: isDragging ? "lg" : "sm",
      style: {
        transform: CSS.Transform.toString(transform),
        transition,
      },
    }),
    [id, isDragging, setNodeRef, transform, transition]
  );

  const draggableItemHandleProps = useMemo(
    () => ({
      ref: setDraggableNodeRef,
      ...attributes,
      ...listeners,
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [attributes, isDragging, listeners, setDraggableNodeRef]
  );

  return (
    <Box
      display={visible ? "block" : "none"}
      bgColor={selected ? "blue.200" : "teal.200"}
      w={`${width / (landscape ? 1 : ratio)}vw`}
      h={`${width / (landscape ? ratio : 1)}vw`}
      borderRadius={8}
      onClick={onSelect}
      {...draggableItemStyle}
    >
      <Tag {...draggableItemHandleProps}>{id}</Tag>
      <Stage {...getStageSize()} draggable>
        <Layer>
          <Image
            {...getImageSize()}
            {...getOffset()}
            image={image}
            rotation={landscape ? 0 : 270}
          />
        </Layer>
      </Stage>
    </Box>
  );
};
