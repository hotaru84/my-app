import { FC, useEffect, useMemo } from "react";
import {
  Card,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";

type Bins = {
  r: number;
  c: number;
}

type binRange = {
  minr: number;
  maxr: number;
  minc: number;
  maxc: number;
}


const Analytics: FC = () => {
  const step = 50;
  const data_max = step * 50;
  const data = useMemo(() => [...Array(1000)].map((_, i): Bins => ({
    r: data_max * Math.random() + step,
    c: data_max * Math.random() + step,
  })), [data_max]);


  const hists = useMemo(() => {
    const range = data.reduce<binRange>((range, obj) => ({
      minr: Math.min(range.minr, obj.r),
      maxr: Math.max(range.maxr, obj.r),
      minc: Math.min(range.minc, obj.c),
      maxc: Math.max(range.maxc, obj.c),
    }), { minr: Infinity, maxr: 0, minc: Infinity, maxc: 0 });

    const numOfRows = Math.floor((range.maxr - range.minr) / step) + 1;
    const numOfColumns = Math.floor((range.maxc - range.minc) / step) + 1;
    const bins = [...Array<number>(numOfRows)].map(_ => [...Array<number>(numOfColumns)].fill(0));

    data.forEach((b) => {
      const r = Math.floor((b.r - range.minr) / step);
      const c = Math.floor((b.c - range.minc) / step);
      if (r < numOfRows && c < numOfColumns) bins[r][c]++;
    });

    return {
      bins,
      rstep: step,
      cstep: step,
      rmin: Math.floor(range.minr / step) * step,
      cmin: Math.floor(range.minc / step) * step
    };
  }, [data]);


  return < VStack w="full" gap={0} >
    <Navigation />
    <Card w="50%" borderRadius={16} p={4}>
      <HeatmapChart ratio={1.6} {...hists} />
    </Card>
  </VStack >;
};

export default Analytics;
