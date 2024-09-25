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
  const step = 100;
  const data_max = 1000;
  const data = useMemo(() => [...Array(100)].map((_, i): Bins => ({
    r: data_max * Math.random(),
    c: data_max * Math.random(),
  })), []);

  const range = data.reduce<binRange>((range, obj) => ({
    minr: Math.min(range.minr, obj.r),
    maxr: Math.max(range.maxr, obj.r),
    minc: Math.min(range.minc, obj.c),
    maxc: Math.max(range.maxc, obj.c),
  }), { minr: Infinity, maxr: 0, minc: Infinity, maxc: 0 });

  const numOfRows = Math.floor((range.maxr - range.minr) / step) + 1;
  const numOfColumns = Math.floor((range.maxc - range.minc) / step) + 1;
  
  const hists = new Array(numOfRows).map(_ => new Array(numOfColumns).fill(0));

  useEffect(() => {
    data.forEach((b) => {
      const r = Math.floor(b.r / step);
      const c = Math.floor(b.c / step);
      hists[r][c]++;
    });

  }, [data, hists, numOfColumns, numOfRows]);

  return < VStack w="full" gap={0} >
    <Navigation />
    <Card w="50%" borderRadius={16}>
      <HeatmapChart ratio={2} rowstep={step} colstep={step} hists={hists} />
    </Card>
  </VStack >;
};

export default Analytics;
