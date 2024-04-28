import { Box, Tooltip } from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { Layer, Stage, Rect } from "react-konva";
import { useDragSortableItem } from "./useDragSortableItem";
import { useMeasure } from "@react-hookz/web";
import { useSize } from "@chakra-ui/react-use-size";
import {
  useBoolean,
  useFullscreen,
  useHover,
  useInterval,
  useKey,
  useList,
  useRaf,
  useRafLoop,
  useToggle,
  useTween,
} from "react-use";
import Konva from "konva";
import { useSpring } from "framer-motion";

interface Props {
  width: number;
  onSelect: () => void;
}
type RectProp = {
  w: number;
  h: number;
  x: number;
  y: number;
  lastUpdateTick: number;
};

export const Device: FC<Props> = ({ width, onSelect }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentSize = useSize(parentRef);
  const [rects, { set: setRects }] = useList<RectProp>([]);

  const [stop, start, isStart] = useRafLoop((t) => {
    const pixPerSec = 100;
    const minX = rects.reduce((v, c) => Math.min(v, c.x), 1000);
    const candidate = [
      ...rects
        .map((c) => {
          c.x += (pixPerSec * (t - c.lastUpdateTick)) / 1000;
          c.lastUpdateTick = t;
          return c;
        })
        .filter((c) => c.x < 300),
    ];
    if (candidate.length < 100 && minX > 20)
      candidate.push({ w: 10, h: 10, x: 0, y: 0, lastUpdateTick: t });
    setRects(candidate);
  });

  const onToggle = () => {
    if (isStart()) stop();
    else start();
  };

  return (
    <Box
      ref={parentRef}
      w={`${width}vw`}
      h={`${width / 2}vw`}
      borderRadius={8}
      onClick={onToggle}
    >
      <Stage width={parentSize?.width} height={parentSize?.height}>
        <Layer>
          {rects.map((r) => (
            <Rect fill={"teal"} x={r.x} y={r.y} width={r.w} height={r.h}></Rect>
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};
