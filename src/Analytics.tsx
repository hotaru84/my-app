import { FC, useMemo, useState } from "react";
import {
  Card,
  HStack,
  VStack,
  Spacer,
  IconButton,
  Button,
  ButtonGroup,
  TabList,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  Flex
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useCorrelation } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import { Select } from "chakra-react-select";
import { TbArrowBack, TbMinus, TbPlus } from "react-icons/tb";
import { useCounter } from "react-use";
import { useBeep } from "./useBeep";
import GridLayoutTemplate from "./gridLayoutTemplate";
import { DragSortableContext } from "./dragSortableContext";
import { useDragSortableItem } from "./useDragSortableItem";

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

interface Props {
  id: string;
}

const SortableCard: FC<Props> = ({ id }) => {
  const { itemProps } = useDragSortableItem(id);
  return (
    <Card
      {...itemProps}
      borderRadius={8}
      colorScheme="cyan"
      aspectRatio={1}
      h="full"
    >{id}</Card>
  );
}

const SortableBox: FC = () => {

  function getUniqueStr(id: number) {
    var strong = 100;
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16) + id;
  }

  const [ids, setIds] = useState<string[]>([...Array(4)].map((_, i) => getUniqueStr(i)));

  return <Flex>
    <DragSortableContext ids={ids} setIds={setIds}>
      {ids.map(id => (<SortableCard key={id} id={id} />))}
    </DragSortableContext>
  </Flex>
}

const Analytics: FC = () => {
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

  return <Flex bgColor={'gray.100'} p={2} w="full" h="full">
    <GridLayoutTemplate
      vertical
      childrens={[...Array(5)].map((_, key) => (
        <SortableBox key={key} />
      ))} />
  </Flex>;

  return <VStack w="full" gap={0} >
    <Navigation>
      <>
        <Button onClick={beep}>btn</Button>
      </>
    </Navigation>
    <HStack w="full" p={4} gap={4}>
      <Card borderRadius={16} p={4} gap={2} w="xl">
        <Tabs variant='enclosed' colorScheme='cyan'>
          <TabList>
            <Tab>Heatmap</Tab>
            <Tab>Histgram</Tab>
            <Spacer />
          </TabList>
          <TabPanels>
            <TabPanel>
              <HeatmapChart ratio={1.6} data={corr} />
              <HStack mt={4}>
                <Spacer />
                {rowKeySelect}
                {colKeySelect}
                {stepSlider}
              </HStack>
            </TabPanel>
            <TabPanel>
              <HistgramChart ratio={1.6} data={hist} />
              <HStack mt={4}>
                <Spacer />
                {rowKeySelect}
                {stepSlider}
              </HStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </HStack>
  </VStack >;
};

export default Analytics;
