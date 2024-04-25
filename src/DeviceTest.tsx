import {
  Text,
  IconButton,
  ButtonGroup,
  Card,
  Flex,
  Spacer,
  Button,
  Heading,
  StatUpArrow,
  TableContainer,
  Box,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useState } from "react";
import { Device } from "./Device";
import { DragSortableContext } from "./dragSortableContext";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesNormalBand,
  SparklinesReferenceLine,
  SparklinesSpots,
  SparklinesText,
} from "react-sparklines";
import { useInterval, useList } from "react-use";
import { randomInt } from "crypto";

const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "second" },
  { id: "2", title: "second" },
];
export const DeviceTest = () => {
  const [selectTime, onSelectTime] = useState<number[]>([]);
  const [selected, onSelect] = useState("");
  const [fps, { push, removeAt }] = useList([12, 123, 63, 256, 75, 43]);
  const maxSingleW = 40;
  const baseW = 20;
  const [ids, setIds] = useState<string[]>(Items.map((i) => i.id));

  useInterval(() => {
    push(Math.floor(Math.random() * 255));
    removeAt(0);
  }, 500);

  return (
    <Card
      borderRadius={16}
      as={motion.div}
      layout
      w="50vw"
      maxH="94vh"
      p={2}
      gap={2}
    >
      <Flex>
        <IconButton icon={<TbTable />} aria-label={""} />
        <Spacer />

        <Tooltip label={fps.map((d) => d + ",")}>
          <VStack w="80px" h="30px" mx={2} alignItems={"end"}>
            <Sparklines data={fps} style={{ opacity: 0.5 }}>
              <SparklinesBars style={{ color: "" }} />
            </Sparklines>
          </VStack>
        </Tooltip>
        <Heading as="em" fontSize={"2rem"} alignContent={"end"}>
          <StatUpArrow fontSize={"1rem"} alignSelf={"end"} />
          123
        </Heading>
        <Text fontSize={"1rem"} fontWeight={"light"} alignSelf={"end"} mx={2}>
          num/sec
        </Text>
      </Flex>
      <DragSortableContext ids={ids} setIds={setIds}>
        <Flex
          align={"center"}
          justify={"center"}
          gap={2}
          overflowY={"auto"}
          flexWrap={"wrap"}
          flexGrow={4}
          flexShrink={1}
        >
          {ids.map((id) => {
            const item = Items.find((i) => i.id === id);
            const isSelected = selected === item?.id;
            if (item === undefined) return <></>;
            return (
              <Device
                key={item.id}
                width={isSelected ? maxSingleW : baseW}
                onSelect={() => onSelect(isSelected ? "" : item.id)}
              />
            );
          })}
        </Flex>
      </DragSortableContext>
      <TableContainer
        overflowY={"auto"}
        w="full"
        maxH={"30vh"}
        minH={"100px"}
        flexShrink={5}
        flexGrow={1}
      >
        <TestTable onSelect={onSelectTime} />
      </TableContainer>
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
