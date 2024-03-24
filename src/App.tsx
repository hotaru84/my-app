import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import { DeviceTest } from "./DeviceTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { SampleDraggable } from "./sampledrag";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Flex w="full" justify={"center"} p={4}>
        <ColorModeSwitcher
          position="absolute"
          top={2}
          left={2}
          zIndex={"banner"}
        />
        <DeviceTest />
      </Flex>
    </ChakraProvider>
  );
};
