import { FC, ReactNode, useMemo, useState } from "react";
import {
  Card,
  HStack,
  VStack,
  Spacer,
  IconButton,
  Button,
  ButtonGroup,
  Image,
  Box,
  CardHeader,
  Switch,
  useDisclosure,
  Icon,
  CardBody,
  CardFooter,
  Stack,
  Input,
  Hide,
  CardProps,
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
  Tooltip
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import HeatmapChart from "./HeatmapChart";
import { useHistgram, useCorrelation } from "./useHistgram";
import HistgramChart from "./HistgramChart";
import { Select } from "chakra-react-select";
import { TbArrowBack, TbDragDrop, TbMinus, TbPlus } from "react-icons/tb";
import { useCounter, useLocalStorage, useMeasure } from "react-use";
import { useBeep } from "./useBeep";
import { Layout, Layouts, ReactGridLayoutProps, Responsive, WidthProvider } from "react-grid-layout";

import './react-grid-layout.css'
import { MdOutlineDragIndicator } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { title } from "process";

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

  return <VStack w="full"
    gap={0}
    backgroundSize={"cover"}
    backgroundColor="rgba(255,255,255,0.5)"
    backgroundBlendMode={"lighten"}>
    <Navigation>
      <Spacer />
      <Button onClick={beep}>btn</Button>
      <Switch onChange={onToggle} isChecked={isOpen}>Lock</Switch>
      <Button onClick={removeLayout}>reset</Button>
      <Input size='md' type='file' />
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
        compactType={null}
        onLayoutChange={onLayoutChange}
      >
        <motion.div key={"heatmap"}>
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
        <motion.div key={"histgram"}>
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
        <motion.div key={"image"}>
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
      </ResponsiveGridLayout>
    </Box>
  </VStack >
};

export default Analytics;
