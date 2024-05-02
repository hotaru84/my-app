import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { DeviceTest } from "./DeviceTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <PanelGroup direction="horizontal" autoSaveId={"app-layout"}>
        <Panel defaultSize={30}>
          <ColorModeSwitcher />
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel minSize={30}>
          <Box p={2} h="full" w="full">
            <DeviceTest />
          </Box>
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel defaultSize={30}>right</Panel>
      </PanelGroup>
    </ChakraProvider>
  );
};
