import { Box, Tooltip } from "@chakra-ui/react";
import { FC, useRef } from "react";
import { Layer, Stage, Rect } from "react-konva";
import { useDragSortableItem } from "./useDragSortableItem";
import { useMeasure } from "@react-hookz/web";
import { useSize } from "@chakra-ui/react-use-size";
import {
  useBoolean,
  useFullscreen,
  useHover,
  useKey,
  useToggle,
} from "react-use";

interface Props {
  width: number;
  onSelect: () => void;
}
export const Device: FC<Props> = ({ width, onSelect }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentSize = useSize(parentRef);
  const [isSelect, onToggle] = useToggle(false);
  useKey("ArrowUp", () => console.log("up"));

  return (
    <Box ref={parentRef} w={`${width}vw`} h={`${width / 2}vw`} borderRadius={8}>
      <Stage width={parentSize?.width} height={parentSize?.height}>
        <Layer>
          <Rect
            fill={"teal"}
            opacity={isSelect ? 0.8 : 0.5}
            width={parentSize?.width}
            height={parentSize?.height}
            onClick={onToggle}
          ></Rect>
        </Layer>
      </Stage>
    </Box>
  );
};
