import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardProps,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { DragSortableContext } from "./dragSortableContext";
import { FC, useState } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import CardTemplate from "./cardTemplate";
import { useIdsSearchParam } from "./userIdsSearchParam";
import { TbTrash } from "react-icons/tb";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";

function getUniqueStr(id: number) {
  var strong = 100;
  return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16) + id;
}


interface Props {
  num: number;
  props: CardProps;
}

const CardsByCategory: FC<Props> = ({ num, props }) => {
  const [ids, setIds] = useState<string[]>([...Array(num)].map((_, i) => getUniqueStr(i)));

  return (
    <Box
      sx={{ scrollSnapAlign: "start", scrollMargin: 2 }}
    >
      <Flex p={0} pb={2}>Category</Flex>
      <DragSortableContext ids={ids} setIds={setIds}>
        <Wrap
          shouldWrapChildren
          gap={4}
        >
          {ids.map((id) =>
            <CardTemplate
              key={id}
              id={id}
              isTile
              cardProps={{
                ...props,
                sx: { scrollSnapAlign: "start", scrollMargin: 2 }
              }}
              header={`${id}`}
              indicator="green.300"
              actionL={
                <ButtonGroup m={2}>
                  <Button>test</Button>
                </ButtonGroup>
              }
            />)}
        </Wrap>
      </DragSortableContext>
    </Box>
  );
};
export const Cards = () => {
  const { selected, clearAll } = useIdsSearchParam();

  return (
    <HStack w="full" h="full" align={"start"} p={2} sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
      <ButtonGroup orientation="vertical" position={'sticky'} top={0} left={0}>
        <ColorModeSwitcher />
        {selected.length > 0 && <IconButton
          aria-label={"clearall"}
          icon={<MdClose />}
          onClick={clearAll}
          as={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          _after={{
            display: 'block',
            bgSize: 8,
            bgColor: 'green.300'
          }}
        />}
      </ButtonGroup>
      <VStack align={"start"} gap={4} sx={{ scrollSnapAlign: "start", scrollMargin: 2 }} w="full">
        <Flex w="full"><Button>TEST</Button> </Flex>
        <CardsByCategory num={6} props={{ w: { base: 'full', sm: 'calc(50vw - 64px)', md: 'calc(30vw - 8px)' } }} />
        <CardsByCategory num={3} props={{ w: '200px' }} />
        <CardsByCategory num={4} props={{ w: "100px" }} />
      </VStack>
    </HStack>
  );
}