import {
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  HStack,
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
import { Navigation } from "./Navigation";
import Packages from "./Packages";
import System from "./System";
import { FC } from "react";
import LayoutTest from "./LayoutTest";

const BaseLayout: FC = () => {
  return (
    <HStack w="full" h="100vh">
      <Navigation />
      <Flex w="full" h="100vh" overflow={"auto"}>
        <Outlet />
      </Flex>
    </HStack>
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
