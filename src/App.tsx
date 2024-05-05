import { ChakraProvider, Flex, Grid, GridItem, theme } from "@chakra-ui/react";
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

const BaseLayout: FC = () => {
  return (
    <Grid
      templateAreas={{
        base: `"page page" "nav nav"`,
        sm: `"nav page" "nav page"`,
      }}
      gridTemplateRows={"auto 100px"}
      gridTemplateColumns={"100px auto"}
      h="100vh"
    >
      <GridItem area="nav">
        <Navigation />
      </GridItem>
      <GridItem area="page">
        <Flex
          w={{ base: "100vw", sm: "calc(100vw - 100px)" }}
          h={{ base: "calc(100vh - 100px)", sm: "100vh" }}
          overflow={"auto"}
        >
          <Outlet />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route path="dashboard" element={<Dashboad />}></Route>
            <Route path="packages" element={<Packages />}></Route>
            <Route path="system" element={<System />}></Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
