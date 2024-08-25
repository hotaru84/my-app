import { FC } from "react";
import {
  VStack,
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";


const Analytics: FC = () => {

  return <VStack w="full" gap={0}>
    <Navigation />
    <VStack w="full" sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
    </VStack>
  </VStack>;
};

export default Analytics;
