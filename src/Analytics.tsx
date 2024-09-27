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

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

const Analytics: FC = () => {
  const step = 50;
  const data_max = step * 20;
  const data = useMemo(() => [...Array(1000)].map((_, i): Bin => ({
    a: gaussianRandom(data_max, 1) * step,
    b: gaussianRandom(data_max, 1.2) * step,
    c: gaussianRandom(data_max, 1.4) * step,
    d: data_max * Math.random() + step,
  })), [data_max]);

  const heatmap = useHistgram2d(data, 'a', step, 'b', step);
  const hist = useHistgram(data, 'c', step);

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
