import { FC, useMemo } from "react";
import {
  Card,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useHistgram2d } from "./useHistgram";
import HistgramChart from "./HistgramChart";

type Bin = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const Analytics: FC = () => {
  const step = 50;
  const data_max = step * 20;
  const data = useMemo(() => [...Array(1000)].map((_, i): Bin => ({
    a: data_max * Math.random() + step,
    b: data_max * Math.random() + step,
    c: data_max * Math.random() + step,
    d: data_max * Math.random() + step,
  })), [data_max]);

  const heatmap = useHistgram2d(data, 'a', 50, 'c', 50);
  const hist = useHistgram(data, 'c', 50);

  return < VStack w="full" gap={0} >
    <Navigation />
    <HStack w="full" p={4} gap={4}>
      <Card borderRadius={16} p={4} w="full">
        <HeatmapChart ratio={1.6} data={heatmap} />
      </Card>
      <Card borderRadius={16} p={4} w="full">
        <HistgramChart ratio={1.6} data={hist} />
      </Card>
    </HStack>
  </VStack >;
};

export default Analytics;
