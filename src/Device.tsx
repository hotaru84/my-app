import { Box, Icon, Tag } from "@chakra-ui/react";
import { FC, useCallback, useMemo, useRef } from "react";
import { useSize } from "@chakra-ui/react-use-size";
import { Layer, Stage, Image } from "react-konva";
import useImage from "use-image";
import { useDraggableItem } from "./useDraggableItem";
import { MdDragIndicator } from "react-icons/md";

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
  const { itemProps, handleProps } = useDraggableItem(id);

  return (
    <Box
      display={visible ? "block" : "none"}
      bgColor={selected ? "blue.200" : "teal.200"}
      w={`${width / (landscape ? 1 : ratio)}vw`}
      h={`${width / (landscape ? ratio : 1)}vw`}
      borderRadius={8}
      onClick={onSelect}
      {...itemProps}
    >
      <Box {...handleProps} m={2}>
        <MdDragIndicator color="white" />
      </Box>
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
