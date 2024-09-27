import { FC, useEffect, useMemo } from "react";
import {
  Card,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram } from "./useHistgram";

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

  const histgram = useHistgram(data, 'a', 50, 'c', 50);

  return < VStack w="full" gap={0} >
    <Navigation />
    <Card w="50%" borderRadius={16} p={4}>
      <HeatmapChart ratio={1.6} histgram={histgram} />
    </Card>
  </VStack >;
};

export default Analytics;
