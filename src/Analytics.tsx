import { FC } from "react";
import {
  AspectRatio,
  Card,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import TreemapChart from "./TreemapChart";
import TrendlineChart from "./TrendlineChart";


const Analytics: FC = () => {

  return <VStack w="full" gap={0}>
    <Navigation />
    <Card w="90%" h="90%" borderRadius={16}>
      <AspectRatio>
        <TrendlineChart />
      </AspectRatio>
      <TreemapChart />
      {/**
       * type of visualization
       * tree-map
       * histgram
       * timeline
       * heatmap
       * 
       */}
      {/** 
        * filter/data
        * 
        * timeframe
        * 
        * package l/w/h
        * 
        * outdata
        * 
        * code settings
        * 
        * result code
        * 
        */}
    </Card>
  </VStack>;
};

export default Analytics;
