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
const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "first" },
  { id: "2", title: "first" },
  { id: "3", title: "first" },
  { id: "4", title: "first" },
  { id: "5", title: "first" },
  { id: "6", title: "first" },
];

interface Props {
  minW: string
}

const CardsByCategory: FC<Props> = ({ minW }) => {
  const [ids, setIds] = useState<string[]>(Items.map((i) => i.id));

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
        <CardsByCategory minW="20vw" />
        <CardsByCategory minW="10vw" />
        <CardsByCategory minW="5vw" />
      </VStack>
    </HStack>
  );
}