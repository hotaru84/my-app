import { FC } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Tag,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Tb123, TbPlus } from "react-icons/tb";
import ListDetailTemplate from "./listDetailTemplate";
import CardTemplate from "./cardTemplate";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import {
  GroupBase,
  Select,
  components,
} from "chakra-react-select";
import { motion } from "framer-motion";

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
      actionL={<Button as={NavLink} to={"test"} onClick={(e) => e.stopPropagation()}>
        Select
      </Button>}
      isDisabled={false}
      id={id} />
  );
};

interface Op {
  value: number;
  label: string;
}

const render = () => {
  return (
    <ButtonGroup w="full">
      <Spacer />
      <IconButton aria-label="toogle" icon={<Tb123 />} />
      <Select<Op, true, GroupBase<Op>>
        isMulti
        options={[
          { value: 1, label: "value1" },
          { value: 2, label: "value2" },
          { value: 3, label: "value3" },
          { value: 4, label: "value4" },
          { value: 5, label: "value5" },
          { value: 6, label: "value6" },
          { value: 7, label: "value7" },
          { value: 8, label: "value8" },
          { value: 9, label: "value9" },
          { value: 10, label: "value0" },
        ]}
        placeholder="Groups"
        closeMenuOnSelect={false}
        isClearable={true}
        useBasicStyles
        variant="filled"
        hideSelectedOptions={false}
        selectedOptionStyle="check"
        components={{
          ValueContainer: (props) => {
            return (
              <components.ValueContainer {...props}>
                {props.getValue().length < 2 ? (
                  props.children
                ) : (
                  <Tag>{props.getValue().length} selected</Tag>
                )}
              </components.ValueContainer>
            );
          },
        }}
      />
    </ButtonGroup>
  );
};

const TestPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ListDetailTemplate
      list={
        <HStack h="full" align={"start"}>
          <VStack as={motion.div} mx={2} layout>
            <Button
              leftIcon={<TbPlus />}
              colorScheme="cyan"
              boxShadow={"lg"}
              justifyContent="flex-start"
              iconSpacing={0}
              my={2}
            >
              {""}
            </Button>
          </VStack>
          <Flex wrap={"wrap"} m={4} gap={4}>
            {cards.map((c, i) => (
              <SampleCard key={i} id={i.toString()} type={c} />
            ))}
          </Flex>
        </HStack>
      }
      detail={<Outlet />}
    />
  );
};

export default TestPage;
