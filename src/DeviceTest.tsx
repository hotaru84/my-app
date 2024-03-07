
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
} from "@chakra-ui/react";
import { TbArrowsMove, TbTable, TbZoomIn, TbZoomOut, TbZoomReset } from "react-icons/tb";
import { motion } from "framer-motion";
import { TestTable } from "./testTable";

interface Props {

}
export const DeviceTest = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen:isTable, onToggle:onToggleTable } = useDisclosure();
  
  const aspect = isOpen ? 4200 / 2000 : 2000 / 4200;
  const topLayout = isOpen
    ? {
        templateAreas: {
          md: `"image stat" "image stat" "table table"`,
          base: `"image" "stat" "table"`,
        },
        gridTemplateRows: {
          md: "1fr 1fr 30vh",
          base: "1fr auto 50vh",
        },
        gridTemplateColumns: {
          md: "60vw 1fr",
          base: "70vw",
        },
      }
    : {
        templateAreas: `"image stat" "image table"`,
        gridTemplateRows: "40vh 50vh",
        gridTemplateColumns: `calc(90vh * ${aspect}) calc(90vw - 90vh * ${aspect})`,
      };

  return (
    <Card
      m={2}
      borderRadius={16}
      as={motion.div}
      layout
      w={"70vw"}
      maxH={{base:"full",md:"90vh"}}
    >
      <ButtonGroup variant={"ghost"} colorScheme="primary" position={"absolute"} top={2} flexDirection={{base:"row",md:"column"}}>
        <Button onClick={onToggle}>ddd</Button>
        <IconButton icon={<TbTable />} aria-label={""} onClick={onToggleTable}/>
      </ButtonGroup>
      
      <SimpleGrid columns={isTable?{base:1,md:2}:1} p={4} spacing={2}>
        <Center as={motion.div} layout>
          <AspectRatio ratio={isOpen?2:0.5} w={isOpen?"100%":"50%"} maxH="80vh">
            <Box bgColor={"teal.200"}/>
          </AspectRatio>
        </Center>
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
      </SimpleGrid>
    </Card>
  );
};
