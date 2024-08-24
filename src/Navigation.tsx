import {
  IconButton,
  Spacer,
  useDisclosure,
  Flex,
  Tag,
  HStack,
  Box,
  TagLeftIcon,
  chakra,
  Input,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  TbCheck,
  TbMenu2,
} from "react-icons/tb";
import { DetailDrawer } from "./DetailDrawer";
import TrendlineChart from "./TrendlineChart";
import { DateTimeRangePicker } from "./DateTimeRangePicker";
import { CustomFilter } from "./CustomFilter";
import { ReportActions } from "./ReportActions";

export const Navigation = () => {
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
      <Tag colorScheme={"green"} w="fit-content">
        <TagLeftIcon as={TbCheck} />
        Ready
      </Tag>
      <HStack gap={2} borderWidth={1} p={2} borderRadius={8} mx="auto">
        <Box w="30vw" h="20px">
          <TrendlineChart />
        </Box>
        <Tag colorScheme={"gray"}>
          123
          <chakra.span textColor={"gray"} fontSize={"0.5rem"} ml={1}>
            pkg/min
          </chakra.span>
        </Tag>
      </HStack>

      <Spacer />
      <ButtonGroup isAttached colorScheme="cyan" variant={'ghost'}>
        <CustomFilter />
        <DateTimeRangePicker />
        <ReportActions />
      </ButtonGroup>
      {DetailDrawer(isOpen, onClose)}
    </Flex>
  );
};
