import { FC } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import CalendarChart from "./CalendarChart";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Cards } from "./Cards";
import { PanelResizeHandler } from "./PanelResizeHandler";
import TreemapChart from "./TreemapChart";
import { Box, Fade } from "@chakra-ui/react";
import { Navigation } from "./Navigation";

const LayoutTest: FC = () => {
  return (
    <Fade in>
      <Navigation>
      </Navigation>
      <PanelGroup direction="horizontal" autoSaveId={"app-layout"}>
        <Panel defaultSize={5}>
          <ColorModeSwitcher />
        </Panel>
        <PanelResizeHandler w={2} h="100vh" />
        <Panel defaultSize={30}>
          <Box p={2} h="full" w="full">
            <Cards />
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
      </PanelGroup>
    </Fade>
  );
};
export default LayoutTest;
