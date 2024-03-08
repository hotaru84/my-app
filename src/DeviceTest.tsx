
import {
  Image,
  Text,
  IconButton,
  ButtonGroup,
  AspectRatio,
  Card,
  StatLabel,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Flex,
  GridItem,
  Grid,
  useDisclosure,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Button,
  Center,
  Wrap,
  useBreakpointValue,
  useBreakpoint,
} from "@chakra-ui/react";
import { TbArrowsMove, TbTable, TbZoomIn, TbZoomOut, TbZoomReset } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useMemo, useState } from "react";

export const DeviceTest = () => {
  const [selected,onSelect] = useState(-1);
  const maxSingleW = 60;
  const baseW = useBreakpointValue({ base: 50, md: 24 }, { ssr: false })??0;
  const { isOpen:isTable, onToggle:onToggleTable } = useDisclosure();
  const lists = useMemo(()=>[...Array(6)].map((i)=>Math.floor(Math.random()*10)%2===0),[]);
  const ratio = 2;

  return (
    <Card
      m={2}
      borderRadius={16}
      as={motion.div}
      layout
      maxW={"80vw"}
      p={2}
    >
      <ButtonGroup variant={"ghost"} colorScheme="primary" position={"absolute"} top={2} left={2}>
        <IconButton icon={<TbTable />} aria-label={""} onClick={onToggleTable}/>
      </ButtonGroup>
      <Wrap shouldWrapChildren align={"center"} justify={"center"} flexGrow={1}>
        {lists.map((b,i)=>(
          <Center as={motion.div} layout key={i}
              display={selected === -1 ? "block":(selected === i?"block":"none")}>
            <Box 
              bgColor={selected === i?"blue.200":"teal.200"} 
              w={`${(selected === i?maxSingleW:baseW)/(b?ratio:1)}vw`}
              h={`${(selected === i?maxSingleW:baseW)/(b?1:ratio)}vw`} 
              borderRadius={8}
              onClick={()=>onSelect(selected===i?-1:i)}
            >
              {80/lists.length/(b?ratio:1)}
            </Box>
          </Center>
        ))}
      </Wrap>
        {isTable &&(
        <VStack>
          <Stat>
            <StatLabel fontSize={"1rem"}>Throughput</StatLabel>
            <StatNumber fontSize={"3rem"}>
              <StatArrow type="increase" />
              30
              <Text as="span" fontSize={"1rem"} fontWeight={"light"}>
                num/sec
              </Text>
            </StatNumber>
            <StatHelpText>1 data</StatHelpText>
          </Stat>
          <TestTable />
        </VStack>)}
    </Card>
  );
};
