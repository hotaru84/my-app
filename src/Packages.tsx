import { FC, ReactElement } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import { TbEdit } from "react-icons/tb";

interface LayoutProps {
  children: [ReactElement, ReactElement, ReactElement];
}

const ListDetailView: FC<LayoutProps> = (props) => {
  return (
    <VStack
      w="full"
      h="full"
      bgColor="white"
      justify={"center"}
      overflow={"hidden"}
    >
      <Flex w="full" h={12} p={2}>
        {props.children[0]}
      </Flex>
      <PanelGroup direction={"horizontal"}>
        <Panel
          minSize={30}
          collapsible
          style={{
            overflow: "auto",
          }}
        >
          {props.children[1]}
        </Panel>
        <PanelResizeHandler
          h="full"
          w={2}
          transitionDelay=".2s"
          _hover={{
            bgColor: "gray",
            transition: "linear .2s",
          }}
        />
        <Panel
          defaultSize={70}
          style={{
            overflow: "auto",
          }}
        >
          {props.children[2]}
        </Panel>
      </PanelGroup>
    </VStack>
  );
};

const Packages: FC = () => {
  return (
    <ListDetailView>
      <ButtonGroup w="full">
        <Spacer />
        <Button leftIcon={<TbEdit />}>Edit</Button>
      </ButtonGroup>
      <Box
        bgColor={"gray.50"}
        minW={"300px"}
        w="full"
        h="full"
        overflow={"auto"}
      >
        List
      </Box>
      <Box
        bgColor={"gray.50"}
        w="full"
        minW="600px"
        minH="600px"
        overflow={"auto"}
        h="full"
      ></Box>
    </ListDetailView>
  );
};

export default Packages;
