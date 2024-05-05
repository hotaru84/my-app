import { FC } from "react";
import { Wrap } from "@chakra-ui/react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import { TbCheck, TbExclamationCircle, TbPackage } from "react-icons/tb";
import StatCard, { StatData } from "./StatCard";

const stats: StatData[] = [
  {
    label: "Throughput",
    score: 12345,
    icon: TbPackage,
    color: "blue.300",
    unit: "num",
    emphasize: true,
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
    <PanelGroup direction="vertical">
      <Panel>
        <Wrap
          shouldWrapChildren
          gap={4}
          p={4}
          h="full"
          justify={"center"}
          overflow={"auto"}
        >
          {stats.map((s) => (
            <StatCard {...s} />
          ))}
        </Wrap>
      </Panel>
      <PanelResizeHandler w="full" h={2} />
      <Panel></Panel>
    </PanelGroup>
  );
};

export default Dashboad;
