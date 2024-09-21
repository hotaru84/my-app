import { FC } from "react";
import {
  Card,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import BubbleChart from "./BubbleChart";


const Analytics: FC = () => {

  return <VStack w="full" gap={0}>
    <Navigation />
    <Card w="50%" borderRadius={16}>
      <BubbleChart ratio={2} />
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
