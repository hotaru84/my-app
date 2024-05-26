import {
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Tab,
  TabList,
  Tabs,
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
  NavLink,
} from "react-router-dom";
import { Navigation } from "./Navigation";
import Packages from "./Packages";
import System from "./System";
import { FC } from "react";
import LayoutTest from "./LayoutTest";

const BaseLayout: FC = () => {
  return (
    <VStack w="full" h="100vh">
      <Navigation />
      <Flex w="full" h="100vh" overflow={"auto"}>
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
            <Route path="packages" element={<Packages />}>
              <Route path="test" element={<LayoutTest />}></Route>
            </Route>
            <Route path="system" element={<System />}></Route>
            <Route path="/" element={<Navigate to="/packages" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
