import {
  ChakraProvider,
  Flex,
  theme,
} from "@chakra-ui/react"
import { DeviceTest } from "./DeviceTest";
import { ColorModeSwitcher } from "./ColorModeSwitcher";


export const App = () => {
  const lists = [...Array(6)].map((i)=>Math.floor(Math.random()*10));

  return (
  <ChakraProvider theme={theme}>
    <Flex w="full" justify={"center"} p={4}>
      <ColorModeSwitcher position="absolute" top={2} left={2} zIndex={"banner"}/>
      <DeviceTest/>
    </Flex>
  </ChakraProvider>);
}
