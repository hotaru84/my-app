import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { DeviceTest } from "./DeviceTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import BarLineTimeChart from "./BarLineTimeChart";
import CalendarChart from "./CalendarChart";
import TreemapChart from "./TreemapChart";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  );
};
