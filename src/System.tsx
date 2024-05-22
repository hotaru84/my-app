import { FC, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Flex,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import ListDetailTemplate from "./listDetailTemplate";
import {
  TbEdit,
  TbPlus,
  TbZoomIn,
  TbZoomOut,
  TbZoomReset,
} from "react-icons/tb";
import { Stage, Layer, Text } from "react-konva";
import { useCounter, useMeasure } from "react-use";
import { Scale } from "chart.js";

const System: FC = () => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const [counter, { inc, dec, reset }] = useCounter(100, 200, 50);

  return (
    <ListDetailTemplate
      header={
        <ButtonGroup w="full" isAttached>
          <IconButton
            icon={<TbZoomIn />}
            onClick={() => inc()}
            aria-label={"zoom"}
          />
          <IconButton
            icon={<TbZoomOut />}
            onClick={() => dec()}
            aria-label={"zoom"}
          />
          <IconButton
            icon={<TbZoomReset />}
            onClick={() => reset()}
            aria-label={"zoom"}
          />
        </ButtonGroup>
      }
      detail={
        <Flex ref={ref} aspectRatio={2.5} p={2}>
          <Stage
            width={width}
            height={height}
            style={{
              backgroundColor: "cyan",
              borderWidth: 1,
              borderColor: "pink",
            }}
            scale={{ x: counter / 100, y: counter / 100 }}
            draggable
          >
            <Layer>
              <Text text={"w:" + width + "px"} x={width / 2} y={height / 2} />
              <Text text={"h:" + height + "px"} x={width / 2} y={height / 3} />
            </Layer>
          </Stage>
        </Flex>
      }
    />
  );
};

export default System;
