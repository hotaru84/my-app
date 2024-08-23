import { FC, useCallback, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Icon,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Skeleton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  TagLeftIcon,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { TbArrowRight, TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import TrendlineChart from "./TrendlineChart";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import BarLineTimeChart from "./BarLineTimeChart";
import { NavLink } from "react-router-dom";

const stats: StatData[] = [
  {
    label: "Throughput",
    score: 12345,
    icon: TbPackage,
    color: "blue.300",
    unit: "num",
  },
  {
    label: "Success",
    score: 92.4,
    icon: TbCheck,
    color: "green.300",
    unit: "%",
  },
  {
    label: "Error",
    score: 0,
    icon: TbExclamationCircle,
    color: "yellow.300",
    unit: "min",
  },
];

const PkgEdgePosSlider: FC = () => {
  const success = useMemo(() => [...Array(10)].map(() => Math.round(Math.random() * 60 + 30)), []);
  const error = useMemo(() => [...Array(10)].map(() => Math.round(Math.random() * 60 + 20)), []);
  const min = Math.min(...success, ...error);
  const [pos, setPos] = useState(min);
  const onChange = useCallback((e: number) => {
    const t = [...success, ...error].reduce((a, b) => (Math.abs(a - e) < Math.abs(b - e)) ? a : b);
    setPos(t);
  }, [error, success]);

  return <Slider
    min={0}
    max={100}
    value={pos}
    colorScheme="orange"
    onChange={onChange}
    mb={8}
  >
    <SliderTrack>
    </SliderTrack>
    {success.map((v, i) =>
      <SliderMark value={v} mt={-1.5} key={"success-" + String(i)}>
        <Box boxSize={3} bgColor={"green.300"} rounded={"full"} />
      </SliderMark>
    )}
    {error.map((v, i) =>
      <SliderMark value={v} mt={-1.5} key={"error-" + String(i)}>
        <Box boxSize={3} bgColor={"gray.300"} rounded={"full"} />
      </SliderMark>
    )}
    <SliderMark value={pos} mt={4} ml={-8} >
      <Tag colorScheme="orange" w={16}> {pos}mm</Tag>
    </SliderMark>
    <SliderThumb boxSize={6} bgColor={'orange.100'}>
      <Icon as={TbPackage} color={'orange.300'} />
    </SliderThumb>
  </Slider>
}

const Dashboad: FC = () => {
  const [selectTime, setSelectTime] = useState(0);


  return (
    <VStack w="full" h="full">
      <Flex w="full" align={"center"} justify={"center"} p={2} gap={4}>
        <Spacer />
        <Tag colorScheme={"green"}>
          <TagLeftIcon as={TbCheck} />
          Ready
        </Tag>
        <HStack gap={2} borderWidth={1} p={2} borderRadius={8} mx="auto">
          <Box w="30vw" h="20px">
            <TrendlineChart />
          </Box>
          <Tag colorScheme={"gray"}>
            123
            <chakra.span textColor={"gray"} fontSize={"0.5rem"} ml={1}>
              pkg/min
            </chakra.span>
          </Tag>
        </HStack>
        <Spacer />
        <DateTimeRangePicker />
      </Flex>
      <Flex
        gap={4}
        px={8}
        pb={4}
        w="full"
        justify={"center"}
        overflow={"auto"}
        flexWrap={"wrap"}
        alignItems={"start"}
        wrap={"wrap"}
      >
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
        <Card
          rounded={16}
          p={4}
          boxShadow={"lg"}
          w="full"
        >
          <Box w="full" >
            <BarLineTimeChart activeTime={selectTime} setActiveTime={setSelectTime} />
          </Box>
        </Card>
        <PkgEdgePosSlider />
        <Card
          rounded={16}
          p={4}
          boxShadow={"lg"}
          flex={"1"}
          flexDir={"row"}
          gap={2}
          h="25vh"
        >
          {[1, 2, 3].map((i) => (
            <Card variant={"outline"} key={i} w="full" boxShadow={0}>
              <HStack gap={2} m={2}>
                <Skeleton w="full" aspectRatio={2} speed={3} />
                <IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../packages" />
              </HStack>
            </Card>))}
        </Card>
        <Card
          rounded={16}
          p={4}
          boxShadow={"lg"}
          flex={"1"}
          maxH="50vh"
        >
          <TableContainer overflowY={"auto"}>
            <Table variant='simple'>
              <Thead position={"sticky"} top={0}>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Thead>
              <Tbody >
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td isNumeric>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td isNumeric>0.91444</Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      </Flex>
    </VStack>
  );
};

export default Dashboad;
