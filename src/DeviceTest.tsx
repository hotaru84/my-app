import {
  Text,
  IconButton,
  ButtonGroup,
  Card,
  StatLabel,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  useDisclosure,
  VStack,
  Wrap,
  useBreakpointValue,
  Flex,
  Spacer,
  CardBody,
  Button,
  Heading,
  StatUpArrow,
  TableContainer,
  CardFooter,
} from "@chakra-ui/react";
import { TbDragDrop2, TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useState } from "react";
import { Device } from "./Device";
import AddNewDialog from "./AddNewDialog";
import { DragSortableContext } from "./dragSortableContext";

import { SampleDraggable } from "./sampledrag";

const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "second" },
  { id: "2", title: "second" },
];
export const DeviceTest = () => {
  const [selected, onSelect] = useState("");
  const maxSingleW = 55;
  const baseW = useBreakpointValue({ base: 50, md: 24 }, { ssr: false }) ?? 0;
  const { isOpen: isTable, onToggle: onToggleTable } = useDisclosure();
  const [ids, setIds] = useState<string[]>(Items.map((i) => i.id));

  return (
    <Card
      borderRadius={16}
      as={motion.div}
      layout
      w="75vw"
      maxH="94vh"
      gap={2}
      p={2}
    >
      <Flex m={2}>
        <IconButton
          icon={<TbTable />}
          aria-label={""}
          onClick={onToggleTable}
        />
        <Spacer />
        <Heading as="em" fontSize={"2rem"} mr={2}>
          <StatUpArrow fontSize={"1rem"} alignSelf={"end"} />
          123
        </Heading>
        <Text fontSize={"1rem"} fontWeight={"light"} alignSelf={"end"}>
          num/sec
        </Text>
      </Flex>
      <DragSortableContext ids={ids} setIds={setIds}>
        <Flex
          align={"center"}
          justify={"center"}
          flexGrow={12}
          gap={2}
          overflowY={"auto"}
          flexWrap={"wrap"}
        >
          {ids.map((id) => {
            const item = Items.find((i) => i.id === id);
            const isSelected = selected === item?.id;
            if (item === undefined) return <></>;
            return (
              <Device
                key={item.id}
                id={item.id}
                visible={isSelected || selected === ""}
                selected={isSelected}
                width={isSelected ? maxSingleW : baseW}
                landscape={true}
                onSelect={() => onSelect(isSelected ? "" : item.id)}
              />
            );
          })}
        </Flex>
      </DragSortableContext>
      <TableContainer overflowY={"auto"} w="full" flexShrink={"8"} maxH="22vh">
        <TestTable />
      </TableContainer>
      <ButtonGroup mt={0} mx={2}>
        <Button boxShadow={"lg"}>TEST</Button>
      </ButtonGroup>
    </Card>
  );
};
