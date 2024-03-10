
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
  Box,
  Center,
  Wrap,
  useBreakpointValue,
} from "@chakra-ui/react";
import { TbTable } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";
import { useMemo, useState } from "react";
import { Device } from "./Device";

export const DeviceTest = () => {
  const [selected,onSelect] = useState(-1);
  const maxSingleW = 60;
  const baseW = useBreakpointValue({ base: 50, md: 24 }, { ssr: false })??0;
  const { isOpen:isTable, onToggle:onToggleTable } = useDisclosure();
  const lists = useMemo(()=>[...Array(6)].map((i)=>Math.floor(Math.random()*10)%2===0),[]);
  

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
      <Wrap shouldWrapChildren align={"center"} justify={"center"}>
        {lists.map((b,i)=>(
          <Device 
            key={i}
            visible={selected === i || selected === -1} 
            selected={selected === i} 
            width={selected === i? maxSingleW:baseW}
            landscape={b}
            onSelect={()=>onSelect(selected === i ? -1:i)} />
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
