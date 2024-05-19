import { FC, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  Stack,
  Wrap,
  useDisclosure,
} from "@chakra-ui/react";
import { TbEdit } from "react-icons/tb";
import ListDetailTemplate from "./listDetailTemplate";
import CardTemplate from "./cardTemplate";
import { useMeasure } from "react-use";

const cards = [
  {
    h: "aaaaaaaa",
    t: "aaaaaaaa",
    f: "aaaaaaaa",
    i: "green.300",
  },
  {
    h: "bbbbbbbb",
    t: "bbbbbbbb",
    f: "bbbbbbbb",
    i: "green.300",
  },
  {
    h: "cccccccc",
    t: "cccccccc",
    f: "cccccccc",
    i: "green.300",
  },
  {
    h: "dddddddd",
    t: "dddddddd",
    f: "dddddddd",
    i: "green.300",
  },
  {
    h: "eeeeeeee",
    t: "eeeeeeee",
    f: "eeeeeeee",
    i: "green.300",
  },
];

const actions = [
  {
    icon: <TbEdit />,
    label: "edit",
  },
];
const Packages: FC = () => {
  const { isOpen: isTileStyle, onToggle } = useDisclosure();

  return (
    <ListDetailTemplate
      header={
        <ButtonGroup w="full">
          <Spacer />
          <Button leftIcon={<TbEdit />} onClick={onToggle}>
            Edit
          </Button>
        </ButtonGroup>
      }
      list={
        <Flex
          wrap={"wrap"}
          m={isTileStyle ? 4 : 2}
          gap={isTileStyle ? 4 : 1}
          justify={isTileStyle ? "center" : "start"}
        >
          {cards.map((c, i) => (
            <CardTemplate
              key={i}
              header={c.h}
              title={c.t}
              footer={c.f}
              indicator={c.i}
              actions={actions}
              isTile={isTileStyle}
            />
          ))}
        </Flex>
      }
      detail={isTileStyle ? undefined : <Box bgColor={"gray.50"}>test</Box>}
    />
  );
};

export default Packages;
