import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  SimpleGrid,
  IconButton,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Icon,
  Center,
  Stack,
  Button
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useHistgram2d } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import BubbleChart from "./BubbleChart";
import { ReactSelectBaseProps, Select } from "chakra-react-select";
import { TbMinus, TbPlus, TbSettings, TbSettings2 } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { useAudio } from "react-use";
import { useBeep } from "./useBeep";

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

const useKeySelect = (defaultIndex: number) => {
  const [selectedKey, selectKey] = useState(BinValues[defaultIndex]);
  return {
    selectedKey,
    render: useMemo(() => <Select
      menuPortalTarget={document.body}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: "auto" }) }}
      useBasicStyles
      variant="filled"
      focusBorderColor="cyan.400"
      size="sm"
      value={selectedKey}
      options={BinValues}
      onChange={(v) => v !== null && selectKey(v)}
    />, [selectedKey]),
  }
};

const useStepSlider = (defaultStep: number, isVertical?: boolean) => {
  const [step, setStep] = useState(defaultStep);

  return {
    step: step,
    render: useMemo(() =>
      <Stack direction={isVertical ? 'column' : 'row'}>
        <Icon as={TbMinus} />
        <Slider
          value={step}
          onChange={setStep}
          step={5} min={2} max={50}
          w={isVertical ? 4 : 32}
          h={isVertical ? 32 : 4}
          colorScheme="cyan"
          orientation={isVertical ? "vertical" : "horizontal"}
        >
          <SliderTrack>
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Icon as={TbPlus} />
      </Stack>, [isVertical, step])
  }
}

const Analytics: FC = () => {
  const data_max = 500;
  const data = useMemo(() => [...Array(1000)].map((_, i): Bin => ({
    a: Math.round(gaussianRandom(data_max, 1) * 50),
    b: Math.round(gaussianRandom(data_max, 1.2) * 50),
    c: Math.round(gaussianRandom(data_max, 1.4) * 50),
    d: Math.round(data_max * Math.random() + 50),
  })), []);

  const { selectedKey: rowKey, render: rowKeySelect } = useKeySelect(0);
  const { selectedKey: colKey, render: colKeySelect } = useKeySelect(1);
  const { selectedKey: histKey, render: histKeySelect } = useKeySelect(1);
  const { step: rstep, render: rowStepSlider } = useStepSlider(10, true);
  const { step: cstep, render: colStepSlider } = useStepSlider(10);
  const { step, render: stepSlider } = useStepSlider(10);

  const heatmap = useHistgram2d(data, rowKey.value, rstep, colKey.value, cstep);
  const hist = useHistgram(data, histKey.value, step);

  const { beep } = useBeep();

  return <VStack w="full" gap={0} >
    <Navigation >
      <>
        <Button onClick={beep}>btn</Button>
      </>
    </Navigation>
    <HStack w="full" p={4} gap={4}>
      <Card borderRadius={16} p={4} w="full" gap={2}>
        <HStack w="full">
          <Heading textColor={'GrayText'} fontSize={"lg"} ml={4}>Data</Heading>
          <Spacer />
          {rowKeySelect}
          <Icon as={MdClose} textColor={"GrayText"} />
          {colKeySelect}
        </HStack>
        <HStack justifyContent={"center"} align={"center"} w="full">
          {rowStepSlider}
          <Box w="full">
            <HeatmapChart ratio={1.6} data={heatmap} />
            <Center>
              {colStepSlider}
            </Center>
          </Box>
        </HStack>
      </Card>
      <Card borderRadius={16} p={4} w="full" gap={2}>
        <HStack w="full">
          <Heading textColor={'GrayText'} fontSize={"lg"} ml={4}>Data</Heading>
          <Spacer />
          {histKeySelect}
        </HStack>
        <HistgramChart ratio={1.6} data={hist} />
        <Center>
          {stepSlider}
        </Center>
      </Card>
    </HStack>
  </VStack >;
};

export default Analytics;
