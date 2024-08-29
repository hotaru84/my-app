import { FC } from "react";
import {
  Card,
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import TreemapChart from "./TreemapChart";


const Analytics: FC = () => {

  return <VStack w="full" gap={0}>
    <Navigation />
    <VStack w="full" sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
      <Card
        rounded={16}
        p={4}
        gap={2}
        w="80%"
      >
        <TreemapChart />
      </Card>
    </VStack>
  </VStack>;
};

export default Analytics;
