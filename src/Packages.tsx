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
import { Outlet, useSearchParams } from "react-router-dom";

type CardType = {
  h: string;
  t: string;
  f: string;
  i: string;
};

const cards: CardType[] = [
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

interface SampleCardProps {
  id: string;
  type: CardType;
}

function useIdSearchParams(id: string, multi: boolean = true) {
  const [params, setParams] = useSearchParams();
  const ids = params.getAll("id");
  const isSelected = ids.includes(id);
  const deselectAll = () => {
    setParams(
      (p) => {
        p.delete("id");
        return p;
      },
      { replace: true }
    );
  };
  const select = () => {
    if (!multi) deselectAll();
    if (!isSelected) {
      setParams(
        (p) => {
          p.append("id", id);
          return params;
        },
        { replace: true }
      );
    }
  };
  const deselect = () => {
    if (isSelected) {
      params.delete("id");
      if (multi)
        ids.forEach((i) => {
          if (i !== id) params.append("id", i);
        });
      setParams(params, { replace: true });
    }
  };
  const toggle = () => {
    isSelected ? deselect() : select();
  };

  return {
    isSelected,
    toggle,
    deselectAll,
  };
}

const SampleCard: FC<SampleCardProps> = ({ id, type }) => {
  const { isSelected, toggle } = useIdSearchParams(id);

  return (
    <CardTemplate
      header={type.h}
      title={type.t}
      footer={type.f}
      indicator={type.i}
      actionL={<Button onClick={toggle}>Select</Button>}
      isSelected={isSelected}
    />
  );
};

const Packages: FC = () => {
  const { isOpen: isTileStyle, onToggle } = useDisclosure();
  const [params] = useSearchParams();

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
            <SampleCard key={i} id={i.toString()} type={c} />
          ))}
        </Flex>
      }
      detail={isTileStyle ? undefined : <Outlet />}
    />
  );
};

export default Packages;
