import {
  Button,
  ButtonGroup,
  Card,
  Flex,
  HStack,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { DragSortableContext } from "./dragSortableContext";
import { FC, useState } from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import CardTemplate from "./cardTemplate";

function getUniqueStr(id: number) {
  var strong = 100;
  return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16) + id;
}


interface Props {
  minW: string
}

const CardsByCategory: FC<Props> = ({ minW }) => {
  const [ids, setIds] = useState<string[]>([...Array(6)].map((_, i) => getUniqueStr(i)));

  return (
    <Card variant={'outline'} p={2} w="full"
      sx={{ scrollSnapAlign: "start", scrollMargin: 2 }}>
      <Flex p={0} pb={2}>Category</Flex>
      <DragSortableContext ids={ids} setIds={setIds}>
        <Wrap
          spacing={4}
          justify={"center"}
          shouldWrapChildren
        >
          {ids.map((id) =>
            <CardTemplate
              key={id}
              id={id}
              isTile
              cardProps={{
                minW,
                aspectRatio: 2,
                sx: { scrollSnapAlign: "start", scrollMargin: 2 }
              }}
              header={`${id} is the tile of this card`}
              indicator="green.300"
              actionL={
                <ButtonGroup m={2}>
                  <Button>test</Button>
                </ButtonGroup>
              }
            />)}
        </Wrap>
      </DragSortableContext>
    </Card>
  );
};
export const Cards = () => {
  return (

    <HStack w="full" h="full" align={"start"} p={2} sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
      <ButtonGroup orientation="vertical">
        <ColorModeSwitcher />
      </ButtonGroup>
      <VStack align={"start"} gap={4} sx={{ scrollSnapAlign: "start", scrollMargin: 2 }}>
        <Flex w="full"><Button>TEST</Button> </Flex>
        <CardsByCategory minW="25vw" />
        <CardsByCategory minW="10vw" />
        <CardsByCategory minW="5vw" />
      </VStack>
    </HStack>
  );
}