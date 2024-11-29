import { Children, FC, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Card,
  VStack,
  Spacer,
  IconButton,
  ButtonGroup,
  Image,
  CardHeader,
  Switch,
  useDisclosure,
  CardBody,
  CardFooter,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Avatar,
  Center,
  Portal,
  PopoverFooter,
  Box,
  SimpleGrid
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useCorrelation } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import { Select } from "chakra-react-select";
import { TbArrowBack, TbMinus, TbPlus } from "react-icons/tb";
import { useCounter, useLocalStorage, useMeasure } from "react-use";
import ReactGridLayout, { Layout, Layouts } from "react-grid-layout";

import './react-grid-layout.css'
import { motion } from "framer-motion";

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
  isEditable: boolean;
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
}
const ResizableCard: FC<Props> = ({ isEditable, header, body, footer }) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const cardStyle = () => {
    if (isEditable) return {
      boxShadow: 'lg',
      rounded: 4,
      cursor: 'grab'
    }
    return {}
  };

  return <>
    <Card rounded={16} {...cardStyle()} h="full" ref={ref}>
      {width > 200 ? <>
        <CardHeader p={2}>
          {header}
        </CardHeader>
        <CardBody p={2} maxH={"full"} overflow={'auto'}>
          {body}
        </CardBody><CardFooter p={2}>
          {footer}
        </CardFooter>
      </> : <Center h="full">
        <Popover>
          <PopoverTrigger>
            <Avatar cursor={'pointer'} />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{header}</PopoverHeader>
              <PopoverBody>{body}</PopoverBody>
              <PopoverFooter>{footer}</PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </Center>
      }
    </Card>
  </>
}

const DetailCard: FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tmo = setInterval(() => {
      setCount(count + 1);
    }, 10);
    return () => {
      clearInterval(tmo);
    }
  });

  return <Card>
    {count}
  </Card>
}

interface LayoutProps {
  children: ReactElement[];
  isEditable?: boolean;
  width?: number;
  rowHeight?: number;
}

const FixedLayout: FC<LayoutProps> = ({ children }) => {
  return <SimpleGrid columns={4} gap={4} p={4}>
    {children}
  </SimpleGrid>;
}

const EditableFreeLayout: FC<LayoutProps> = ({ children, isEditable = false, width, rowHeight }) => {
  const [layout, setLayout] = useLocalStorage<Layout[]>('analytics-free-layouts', []);

  const onLayoutChange = (l: Layout[] | undefined) => {
    if (l === undefined) return;

    setLayout(l);
  };

  return <ReactGridLayout
    className="layout"
    containerPadding={[16, 16]}
    margin={[16, 16]}
    isDraggable={isEditable}
    isResizable={isEditable}
    layout={layout}
    onLayoutChange={onLayoutChange}
    compactType={null}
    allowOverlap={true}
    width={width}
    rowHeight={60}
  >
    {children}
  </ReactGridLayout>;
}

const EditableAlignedLayout: FC<LayoutProps> = ({ children, isEditable = false, width, rowHeight }) => {
  const [layout, setLayout] = useLocalStorage<Layout[]>('analytics-align-layouts', []);

  const onLayoutChange = (l: Layout[] | undefined) => {
    if (l === undefined) return;

    setLayout(l);
  };

  return <ReactGridLayout
    className="layout"
    containerPadding={[16, 16]}
    margin={[16, 16]}
    isDraggable={isEditable}
    isResizable={isEditable}
    layout={layout}
    onLayoutChange={onLayoutChange}
    width={width}
    rowHeight={rowHeight}
  >
    {children}
  </ReactGridLayout>;
}

interface ListCardsProps {
  isOpen: boolean;
}
const ListCards: FC<ListCardsProps> = ({ isOpen }) => {

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
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const corr = useCorrelation(data, rowKey.value, step, colKey.value, step);
  const hist = useHistgram(data, rowKey.value, step);
  const CardLayouts = useMemo(() => isOpen && width > 600 ? EditableFreeLayout : FixedLayout, [isOpen, width]);

  return <Box ref={ref} w="full" h="full">
    <CardLayouts isEditable={isOpen} width={width}>
      <motion.div key={"a"}>
        <ResizableCard
          isEditable={isOpen}
          header={"title"}
          body={<HeatmapChart data={corr} />}
          footer={
            <>
              <Spacer />
              {rowKeySelect}
              {colKeySelect}
              {stepSlider}
            </>
          }
        />
      </motion.div>
      <motion.div key={"b"}>
        <ResizableCard
          isEditable={isOpen}
          header={"title"}
          body={<HistgramChart data={hist} />}
          footer={
            <>
              <Spacer />
              {rowKeySelect}
              {stepSlider}
            </>
          }
        />
      </motion.div>
      <motion.div key={"c"}>
        <ResizableCard
          isEditable={isOpen}
          header={"title"}
          body={<Image
            src="sample.svg"
            fit="contain"
          />}
          footer={<></>}
        />
      </motion.div>
    </CardLayouts></Box>;
}

const Analytics: FC = () => {
  const { isOpen, onToggle } = useDisclosure();

  return <VStack w="full" h="full"
    gap={0}
    backgroundSize={"cover"}
    backgroundColor="rgba(255,255,255,0.5)"
    backgroundBlendMode={"lighten"}>
    <Navigation>
      <Spacer />
      <Switch onChange={onToggle} isChecked={isOpen}>Lock</Switch>
      <Input size='md' type='file' />
    </Navigation>
    <Box w="full" h="full">
      <ListCards isOpen={isOpen} />
    </Box>
  </VStack >
};

export default Analytics;
