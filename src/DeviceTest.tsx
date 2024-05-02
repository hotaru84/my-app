import {
  Text,
  IconButton,
  ButtonGroup,
  Card,
  Flex,
  Spacer,
  Button,
  Heading,
  TableContainer,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useState } from "react";
import { Device } from "./Device";
import { Panel, PanelGroup } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";
import { SpeedMeter } from "./SpeedMeter";
const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "first" },
  { id: "2", title: "first" },
  { id: "3", title: "first" },
];

export const DeviceTest = () => {
  const [selectTime, onSelectTime] = useState<number[]>([]);
  console.log("a");

  return (
    <Card
      borderRadius={16}
      as={motion.div}
      layout
      w="full"
      h="full"
      p={2}
      gap={2}
    >
      <Flex>
        <IconButton icon={<TbTable />} aria-label={""} />
        <Spacer />
        <VStack gap={0} justifyItems={"end"}>
          <HStack>
            <Heading as="em" fontSize={"2rem"}>
              123
            </Heading>
            <Text fontSize={"0.7rem"} fontWeight={"light"} alignSelf={"end"}>
              num/sec
            </Text>
          </HStack>
          <SpeedMeter />
        </VStack>
      </Flex>
      <PanelGroup direction="vertical" autoSaveId={"devicetest-layout"}>
        <Panel defaultSize={80} minSize={20}>
          <Flex
            align={"center"}
            justify={"center"}
            gap={2}
            overflowY={"auto"}
            flexWrap={"wrap"}
            h="full"
            direction={"row"}
          >
            {Items.map((id) => {
              return (
                <Device key={id.id} width={100 / Math.min(3, Items.length)} />
              );
            })}
          </Flex>
        </Panel>
        <PanelResizeHandler h={2} w="full" />
        <Panel defaultSize={20}>
          <TableContainer overflowY={"auto"} w="full" h={"full"}>
            <TestTable onSelect={onSelectTime} />
          </TableContainer>
        </Panel>
      </PanelGroup>
      <Flex justify={"end"}>
        <ButtonGroup justifySelf={"end"}>
          <Button size={{ base: "sm", md: "lg" }} boxShadow={"xl"}>
            {selectTime.length > 0 ? "Edit" : "Text"}
          </Button>
        </ButtonGroup>
      </Flex>
    </Card>
  );
};
