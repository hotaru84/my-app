import { FC, useMemo, useState } from "react";
import {
  Card,
  HStack,
  VStack,
  Spacer,
  IconButton,
  Button,
  ButtonGroup,
  Text,
  Box,
  CardHeader,
  Switch,
  useDisclosure,
  Icon
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useCorrelation } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import { Select } from "chakra-react-select";
import { TbArrowBack, TbDragDrop, TbMinus, TbPlus } from "react-icons/tb";
import { useCounter, useLocalStorage } from "react-use";
import { useBeep } from "./useBeep";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";

import './react-grid-layout.css'
import { MdOutlineDragIndicator } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

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

const useStepSlider = (count: number) => {
  const [step, { inc, dec, reset }] = useCounter(
    Math.ceil(Math.log2(count) + 1),
    Math.ceil(Math.log2(count) + 1) * 2,
    1);

  return {
    step: step,
    render: useMemo(() =>
      <ButtonGroup size={"sm"} variant={"ghost"} isAttached colorScheme="cyan">
        <IconButton aria-label={""} onClick={() => dec()} icon={<TbMinus />} />
        <IconButton aria-label={""} onClick={() => inc()} icon={<TbPlus />} />
        <IconButton aria-label={""} onClick={() => reset()} icon={<TbArrowBack />} />
      </ButtonGroup>, [dec, inc, reset])
  }
}

const Analytics: FC = () => {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const { isOpen, onToggle } = useDisclosure();
  const [layouts, setLayouts, removeLayout] = useLocalStorage<Layouts>('analytics-layout', {
    sm: [
      { i: 'heatmap', x: 0, y: 0, w: 2, h: 2 },
      { i: 'histgram', x: 3, y: 0, w: 2, h: 2 }
    ]
  });
  const data_max = 500;
  const data_count = 1000;
  const data = useMemo(() => [...Array(data_count)].map((_, i): Bin => ({
    a: Math.round(gaussianRandom(data_max, 1) * 50),
    b: Math.round(gaussianRandom(data_max, 1.2) * 50),
    c: Math.round(gaussianRandom(data_max, 1.4) * 50),
    d: Math.round(data_max * Math.random() + 50),
  })), []);

  const { selectedKey: rowKey, render: rowKeySelect } = useKeySelect(0);
  const { selectedKey: colKey, render: colKeySelect } = useKeySelect(1);
  const { step, render: stepSlider } = useStepSlider(data_count);

  const corr = useCorrelation(data, rowKey.value, step, colKey.value, step);
  const hist = useHistgram(data, rowKey.value, step);

  const { beep } = useBeep();

  const onLayoutChange = (l: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
  };
  const cardStyle = () => {
    if (isOpen) return {
      boxShadow: 'lg',
      rounded: 4,
      cursor: 'grab'
    }
    return {}
  };

  return <VStack w="full" gap={0} >
    <Navigation>
      <Spacer />
      <Button onClick={beep}>btn</Button>
      <Switch onChange={onToggle} isChecked={isOpen}>Lock</Switch>
      <Button onClick={removeLayout}>reset</Button>
    </Navigation>
    <Box w="full">
      <ResponsiveGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        containerPadding={[16, 16]}
        margin={[16, 16]}
        isDraggable={isOpen}
        isResizable={isOpen}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
      >
        <Card key={'heatmap'} rounded={16} {...cardStyle()}>
          <CardHeader p={2} gap={2} justifyContent={"center"}>
            title
          </CardHeader>
          <Box flex={1} maxH={"calc(100% - 100px)"} pb={2}>
            <HeatmapChart data={corr} />
          </Box>
          <HStack>
            <Spacer />
            {rowKeySelect}
            {colKeySelect}
            {stepSlider}
          </HStack>
        </Card>
        <Card key={'histgram'} rounded={16}  {...cardStyle()}>
          <CardHeader p={2}>title</CardHeader>
          <Box flex={1} maxH={"calc(100% - 100px)"} pb={2}>
            <HistgramChart data={hist} />
          </Box>
          <HStack>
            <Spacer />
            {rowKeySelect}
            {stepSlider}
          </HStack>
        </Card>
      </ResponsiveGridLayout>
    </Box>
  </VStack >
};

export default Analytics;
