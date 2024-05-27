import { FC } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import BarLineTimeChart from "./BarLineTimeChart";
import CalendarChart from "./CalendarChart";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { DeviceTest } from "./DeviceTest";
import { PanelResizeHandler } from "./PanelResizeHandler";
import TreemapChart from "./TreemapChart";
import { Box, Fade } from "@chakra-ui/react";
import { motion } from "framer-motion";

const LayoutTest: FC = () => {
  return (
    <Fade in>
      <PanelGroup direction="horizontal" autoSaveId={"app-layout"}>
        <Panel defaultSize={5}>
          <ColorModeSwitcher />
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel defaultSize={30}>
          <Box p={2} h="full" w="full">
            <DeviceTest />
          </Box>
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel defaultSize={30}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={50}>
              <Box p={2} w="full" h="full">
                <TreemapChart />
              </Box>
            </Panel>
            <PanelResizeHandler h={2} w="full" />
            <Panel defaultSize={50}>
              <Box p={2} w="full" h="full">
                <CalendarChart />
              </Box>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel defaultSize={30}>
          <Box p={2} w="full" h="full" maxH="100vh">
            <BarLineTimeChart />
          </Box>
        </Panel>
      </PanelGroup>
    </Fade>
  );
};
export default LayoutTest;
