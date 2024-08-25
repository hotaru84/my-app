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
import TestPage from "./TestPage";
import System from "./System";
import { FC } from "react";
import LayoutTest from "./LayoutTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Gallery from "./Gallery";
import Analytics from "./Analytics";

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
            <Route path="dashboard" element={<Dashboad />}></Route>
            <Route path="gallery" element={<Gallery />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="test" element={<LayoutTest />}></Route>
            <Route path="system" element={<System />}></Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
