import { FC, useMemo, useState } from "react";
import {
  Card,
  HStack,
  VStack,
  Text,
  Flex,
  CardFooter,
  FormLabel,
  Heading,
  Spacer,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useHistgram2d } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import BubbleChart from "./BubbleChart";
import { ReactSelectBaseProps, Select } from "chakra-react-select";

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

type BinValue<T> = {
  value: keyof T;
  label: string;
  unit: string;
}

const BinValues: BinValue<Bin>[] = [
  {
    value: "a",
    label: "a",
    unit: "mm"
  },
  {
    value: "b",
    label: "b",
    unit: "mm"
  },
  {
    value: "c",
    label: "c",
    unit: "%"
  },
  {
    value: "d",
    label: "d",
    unit: "--"
  }
];

const Analytics: FC = () => {
  const [rowValue, setRowValue] = useState(BinValues[0]);
  const [colValue, setColValue] = useState(BinValues[1]);
  const [histValue, setHistValue] = useState(BinValues[3]);
  const [rstep, setRstep] = useState(10);
  const [cstep, setCstep] = useState(50);
  const [step, setStep] = useState(50);

  const data_max = 500;
  const data = useMemo(() => [...Array(1000)].map((_, i): Bin => ({
    a: gaussianRandom(data_max, 1) * 50,
    b: gaussianRandom(data_max, 1.2) * 50,
    c: gaussianRandom(data_max, 1.4) * 50,
    d: data_max * Math.random() + 50,
  })), []);

  const heatmap = useHistgram2d(data, rowValue.value, rstep, colValue.value, cstep);
  const hist = useHistgram(data, histValue.value, step);

  return <VStack w="full" gap={0} >
    <Navigation />
    <HStack w="full" p={4} gap={4}>
      <Card borderRadius={16} p={4} w="full" textAlign={"center"}>
        <Heading textColor={'GrayText'} mb={2} fontSize={"lg"}>Data</Heading>
        <HeatmapChart ratio={1.6} data={heatmap} rstep={rstep} cstep={cstep} />
        <SimpleGrid columns={2} m={2}>
          <Flex gap={2} justifyContent={"center"}>
            <FormLabel textColor="GrayText">Row</FormLabel>
            <Select
              useBasicStyles
              variant="filled"
              focusBorderColor="cyan.400"
              size="sm"
              value={rowValue}
              options={BinValues}
              onChange={(v) => v !== null && setRowValue(v)}
            />
            <Slider
              value={rstep}
              onChange={setRstep}
              step={5} min={5} max={50} w="50%"
              colorScheme="cyan"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
          <Flex gap={2} justifyContent={"center"}>
            <FormLabel textColor="GrayText">Column</FormLabel>
            <Select
              useBasicStyles
              variant="filled"
              focusBorderColor="cyan.400"
              size="sm"
              value={colValue}
              options={BinValues}
              onChange={(v) => v !== null && setColValue(v)}
            />
            <Slider
              value={cstep} onChange={setCstep}
              step={5} min={5} max={50} w="50%"
              colorScheme="cyan"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </SimpleGrid>
      </Card>
      <Card borderRadius={16} p={4} w="full">
        <HistgramChart ratio={1.6} data={hist} step={step} />
        <HStack justifyContent={"end"} m={2} align={"center"}>
          <FormLabel textColor="GrayText">Row</FormLabel>
          <Select
            useBasicStyles
            variant="filled"
            focusBorderColor="cyan.400"
            size="sm"
            value={histValue}
            options={BinValues}
            onChange={(v) => v !== null && setHistValue(v)}
          />
          <Slider
            value={step} onChange={setStep}
            step={10} min={10} max={100}
            w="50%"
            colorScheme="cyan">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
      </Card>
    </HStack>
  </VStack >;
};

export default Analytics;
