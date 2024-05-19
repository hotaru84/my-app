import { VStack, Flex } from "@chakra-ui/react";
import { FC, ReactElement, useMemo } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import { motion } from "framer-motion";

interface ListDetailTemplateProps {
  header?: ReactElement;
  list?: ReactElement;
  detail?: ReactElement;
}

const ListDetailTemplate: FC<ListDetailTemplateProps> = ({
  header,
  list,
  detail,
}) => {
  const headerHPix = 68;
  const resizable = useMemo(
    () => list !== undefined && detail !== undefined,
    [detail, list]
  );
  const boxprops = {
    w: "full",
    h: header ? `calc(100vh - ${headerHPix}px)` : "100vh",
    overflow: "auto",
  };

  return (
    <VStack
      w="full"
      h="full"
      gap={0}
      bgColor="white"
      justify={"center"}
      overflow={"hidden"}
    >
      {header && (
        <Flex w="full" h={`${headerHPix}px`} p={2}>
          {header}
        </Flex>
      )}
      <PanelGroup direction={"horizontal"}>
        {list && (
          <Panel
            minSize={10}
            collapsible
            defaultSize={detail ? 30 : 100}
            style={{
              overflow: "auto",
            }}
          >
            <motion.div {...boxprops}>{list}</motion.div>
          </Panel>
        )}
        {resizable && (
          <PanelResizeHandler
            h="full"
            w={2}
            transitionDelay=".25s"
            _hover={{
              bgColor: "blue.400",
              opacity: 0.8,
              transition: ".25s",
            }}
          />
        )}
        {detail && (
          <Panel
            defaultSize={list ? 70 : 100}
            style={{
              overflow: "auto",
            }}
          >
            <motion.div {...boxprops}>{detail}</motion.div>
          </Panel>
        )}
      </PanelGroup>
    </VStack>
  );
};
export default ListDetailTemplate;
