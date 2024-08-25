import {
  IconButton,
  Spacer,
  useDisclosure,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  TbMenu2,
} from "react-icons/tb";
import { DetailDrawer } from "./DetailDrawer";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import { CustomFilter } from "./CustomFilter";
import { FilterActions } from "./FilterActions";
import { FC, ReactElement } from "react";

type NavigationProps = {
  children?: ReactElement;
}

export const Navigation: FC<NavigationProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex w="full" align={"center"} bgColor={"bg"} p={2} gap={2}>
      <IconButton
        aria-label="menu"
        variant={"ghost"}
        icon={<TbMenu2 />}
        rounded={8}
        size="lg"
        onClick={onOpen}
        colorScheme="gray"
      />
      {children}
      <Spacer />
      <ButtonGroup isAttached colorScheme="cyan" variant={'ghost'}>
        <CustomFilter />
        <DateTimeRangePicker />
        <FilterActions />
      </ButtonGroup>
      {DetailDrawer(isOpen, onClose)}
    </Flex>
  );
};
