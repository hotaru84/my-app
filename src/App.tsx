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
import { Navigation } from "./Navigation";
import Packages from "./Packages";
import System from "./System";
import { FC } from "react";
import LayoutTest from "./LayoutTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const BaseLayout: FC = () => {
  return (
    <VStack w="100vw" h="100vh">
      <ColorModeSwitcher position={"absolute"} top={2} left={2}/>
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
