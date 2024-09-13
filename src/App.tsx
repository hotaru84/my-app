import {
  ChakraProvider,
  Flex,
  VStack,
  theme,
} from "@chakra-ui/react";
import Dashboad from "./Dashboard";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import System from "./System";
import { FC } from "react";
import LayoutTest from "./LayoutTest";
import Gallery from "./Gallery";
import Analytics from "./Analytics";
import Datatable from "./Datatable";
import { DeviceTest } from "./DeviceTest";

const BaseLayout: FC = () => {
  return (
    <VStack w="100vw" h="100vh">
      <Flex w="full" h="full" overflow={"auto"}>
        <Outlet />
      </Flex>
    </VStack>
  );
};

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route path="layout" element={<DeviceTest />} ></Route>
            <Route path="dashboard" element={<Dashboad />}></Route>
            <Route path="gallery" element={<Gallery />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="datatable" element={<Datatable />} />
            <Route path="test" element={<LayoutTest />}></Route>
            <Route path="system" element={<System />}></Route>
            <Route path="/" element={<Navigate to="/layout" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
