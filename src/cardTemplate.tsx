import {
  Card,
  HStack,
  Avatar,
  VStack,
  Heading,
  Text,
  Stack,
  useDisclosure,
  Spacer,
  Icon,
  Box,
  CardProps,
} from "@chakra-ui/react";
import { FC, ReactElement } from "react";
import { TbCheck } from "react-icons/tb";
import { Indicator } from "./Indicator";
import { AnimatePresence, motion } from "framer-motion";
import { useDragSortableItemWithHandle } from "./useDragSortableItemWithHandle";
import { MdDragIndicator } from "react-icons/md";
import { useIdSearchParam } from "./userIdSearchParam";

interface CardTemplateProps {
  id: string;
  cardProps?: CardProps;
  header?: string;
  title?: string;
  footer?: string;
  indicator?: string;
  avatar?: string;
  actionR?: ReactElement;
  actionL?: ReactElement;
  isTile?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

const CardTemplate: FC<CardTemplateProps> = ({
  id,
  cardProps,
  header,
  title,
  footer,
  indicator,
  avatar,
  actionL,
  actionR,
  isTile = false,
  isDisabled = false,
}) => {
  const { selected: isSelected, onToggle: onToggleSelect } = useIdSearchParam(id);
  const { isOpen: isHover, onOpen: onHoverStart, onClose: onHoverEnd } = useDisclosure();
  const { itemProps, handleProps } = useDragSortableItemWithHandle(id);

  return (
    <Card
      {...itemProps}
      borderRadius={isTile ? 16 : 4}
      variant={isTile ? "elevated" : "filled"}
      filter={isDisabled ? "blur(3px)" : undefined}
      {...(isSelected && {
        borderWidth: 2,
        borderColor: "blue.300",
      })}
      {...cardProps}
    >
      <AnimatePresence>
        {(isSelected || isHover) &&
          <Avatar
            position="absolute"
            top={-3}
            left={-3}
            bgColor={isSelected ? "blue.300" : 'gray.300'}
            rounded="full"
            boxSize={6}
            icon={<TbCheck size={12} />}
            as={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />}
      </AnimatePresence>
      <HStack m={2}>
        <Box
          {...handleProps}
        >
          <Icon as={MdDragIndicator}
            color="GrayText" />
        </Box>
        <Spacer />
        {indicator && (
          <Indicator
            status={indicator}
            boxSize={4}
          />
        )}
      </HStack>
      <Stack gap={2}
        direction={isTile ? "column" : "row"} align={"center"}
        onClick={onToggleSelect}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        {!isTile && <Avatar size="sm"></Avatar>}
        <VStack
          gap={0}
          mx={isTile ? "auto" : 2}
          w="full"
          fontSize={isTile ? "md" : "xs"}
          align={isTile ? "center" : "start"}
        >
          <Text textColor="gray" isTruncated>{header}</Text>
          <Heading fontSize={isTile ? "3xl" : "md"} isTruncated>{title}</Heading>
          <Text textColor="gray">{footer}</Text>
        </VStack>
        {isTile && <Avatar size="lg" mx="auto"></Avatar>}
      </Stack>
      <HStack>
        {actionL}
        <Spacer />
        {actionR}
      </HStack>
    </Card>
  );
};
export default CardTemplate;
