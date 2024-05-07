import { FC } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Flex,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Wrap,
} from "@chakra-ui/react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import { TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";
import TrendlineChart from "./TrendlineChart";

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

const Dashboad: FC = () => {
  return (
    <PanelGroup direction="horizontal">
      <Panel>
        <Flex w="full" justify={"center"} align={"center"} p={2}>
          <ButtonGroup isAttached variant={"outline"} size="sm">
            <Button isActive>Month</Button>
            <Button>Day</Button>
          </ButtonGroup>
          <Spacer />
          <Box h="40px" mx={4}>
            <TrendlineChart />
          </Box>
          <Spacer />
        </Flex>
        <Flex
          gap={4}
          p={4}
          h="full"
          justify={"center"}
          overflow={"auto"}
          flexWrap={"wrap"}
          alignItems={"center"}
        >
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
          <Card rounded={16} p={4} boxShadow="lg" w={"94%"} h="70vh"></Card>
        </Flex>
      </Panel>
      <PanelResizeHandler w={2} h={"full"} />
      <Panel></Panel>
    </PanelGroup>
  );
};

export default Dashboad;
