import { FC, ReactNode, useMemo, useState } from "react";
import {
  VStack,
  Spacer,
  IconButton,
  ButtonGroup,
  Image,
  useDisclosure,
  Input,
  Box,
  Button,
  ScaleFade,
  HStack,
  useBreakpointValue
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useCorrelation } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import { Select } from "chakra-react-select";
import { TbArrowBack, TbCheck, TbEdit, TbMinus, TbPlus } from "react-icons/tb";
import { useCounter, useLocalStorage, useMeasure } from "react-use";

import { MdClose } from "react-icons/md";
import EditableLayout, { EditableLayoutProps } from "./EditableLayout/EditableLayout";
import { Layout } from "react-grid-layout";
import EditableCard from "./EditableLayout/EditableCard";

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
      <ButtonGroup size={"sm"} isAttached>
        <IconButton aria-label={""} onClick={() => dec()} icon={<TbMinus />} />
        <IconButton aria-label={""} onClick={() => inc()} icon={<TbPlus />} />
        <IconButton aria-label={""} onClick={() => reset()} icon={<TbArrowBack />} />
      </ButtonGroup>, [dec, inc, reset])
  }
}



const FixedLayout: FC<EditableLayoutProps> = ({ children }) => {
  return <VStack w="full">
    {children}
  </VStack>;
}

interface EditToolbarProps {
  isOpen: boolean;
  onToggle: () => void;
}
const EditToolbar: FC<EditToolbarProps> = ({ isOpen, onToggle }) => {

  return <ButtonGroup
    position={"absolute"}
    bottom={4}
    right={4}
    rounded={'md'}
    size="lg"
    boxShadow={'lg'}
    colorScheme="cyan"
    gap={2}
  >
    <ScaleFade in={isOpen} unmountOnExit><>
      <Button
        leftIcon={<TbPlus />}
        variant={'ghost'}
      >
        Add
      </Button>
      <Button
        onClick={onToggle}
        leftIcon={<MdClose />}
        variant={'ghost'}
      >
        Cancel
      </Button>
    </>
    </ScaleFade>
    <Button
      onClick={onToggle}
      leftIcon={isOpen ? <TbCheck /> : <TbEdit />}
    >
      {isOpen ? "Apply" : "Edit"}
    </Button>
  </ButtonGroup>;
}
const data_max = 500;
const data_count = 1000;

const ListCards: FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [layout, setLayout] = useLocalStorage<Layout[]>('analytics-align-layouts', []);
  const onLayoutChange = (l: Layout[] | undefined) => { if (l !== undefined) setLayout(l) };
  const CardLayouts = useBreakpointValue<FC<EditableLayoutProps>>({ base: FixedLayout, md: EditableLayout }) ?? FixedLayout;

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

  const cards = [
    {
      key: "img",
      body: <Box
        w="full"
        h="full">
        <Image
          src="sample.svg"
          fit="contain"
          h="full"
        /></Box>
    },
    {
      key: 'hist',
      body: [
        <HistgramChart data={hist} />,
        <ButtonGroup bgColor={'bg'} position={"sticky"} bottom={0}>
          {rowKeySelect}
          {stepSlider}
        </ButtonGroup>
      ]
    }, {
      key: 'heat',
      body: [
        <HeatmapChart data={corr} />,
        <HStack position={"sticky"} bottom={0}>
          <ButtonGroup bgColor={'bg'}>
            {rowKeySelect}
            {colKeySelect}
            {stepSlider}
          </ButtonGroup>
        </HStack>
      ]
    }
  ]

  return <>
    <CardLayouts
      isEditable={isOpen}
      layout={layout}
      numOfRows={12}
      onLayoutChange={onLayoutChange}>
      {cards.map((c, i) => <Box key={c.key}>
        <EditableCard
          isEditable={isOpen}
        >
          {c.body}
        </EditableCard>
      </Box>)}
    </CardLayouts>
    <EditToolbar isOpen={isOpen} onToggle={onToggle} />
  </>;
}

const Analytics: FC = () => {

  return <VStack w="full" h="full"
    gap={0}
    backgroundSize={"cover"}
    backgroundColor="rgba(255,255,255,0.5)"
    backgroundBlendMode={"lighten"}>
    <Navigation>
      <Spacer />
      <Input size='md' type='file' />
    </Navigation>
    <Box w="full" h="full">
      <ListCards />
    </Box>
  </VStack >
};

export default Analytics;
