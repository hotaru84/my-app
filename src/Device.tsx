import { AspectRatio } from "@chakra-ui/react";
import { FC, useRef } from "react";
import { Layer, Stage, Rect } from "react-konva";
import { useSize } from "@chakra-ui/react-use-size";
import { useList, useRafLoop } from "react-use";

interface Props {
  width: number;
  onSelect?: () => void;
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
  }, false);

  const onToggle = () => {
    if (isStart()) stop();
    else start();
  };

  return (
    <AspectRatio
      ref={parentRef}
      w={`calc(${width}% - 32px)`}
      minW="20vw"
      ratio={16 / 7}
      borderRadius={8}
      onClick={onToggle}
      bgColor={"blue.50"}
    >
      <Stage width={parentSize?.width} height={parentSize?.height}>
        <Layer>
          {rects.map((r) => (
            <Rect fill={"teal"} x={r.x} y={r.y} width={r.w} height={r.h}></Rect>
          ))}
        </Layer>
      </Stage>
    </AspectRatio>
  );
};
