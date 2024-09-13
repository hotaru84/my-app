import { Box, Card, CardBody, Icon, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { useList, useRafLoop } from "react-use";
import { useDragSortableItem } from "./useDragSortableItem";
import { TbDragDrop } from "react-icons/tb";
import { MdDragHandle } from "react-icons/md";


type RectProp = {
  w: number;
  h: number;
  x: number;
  y: number;
  lastUpdateTick: number;
};

interface Props {
  id: string;
}
export const Device: FC<Props> = ({ id }) => {
  const { itemProps, handleProps } = useDragSortableItem(id);

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
    <Card
      {...itemProps}
      borderRadius={8}
      onClick={onToggle}
      colorScheme="cyan"
      aspectRatio={1}
    >
      <Icon as={MdDragHandle} {...handleProps} />
      <CardBody>{id}</CardBody>
    </Card>
  );
};
