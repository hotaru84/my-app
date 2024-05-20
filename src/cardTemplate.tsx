import {
  Card,
  HStack,
  Avatar,
  VStack,
  Heading,
  ButtonGroup,
  IconButton,
  Text,
  theme,
  Stack,
  Collapse,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { FC, ReactElement, useMemo } from "react";
import { TbDotsVertical } from "react-icons/tb";
import { Indicator } from "./Indicator";
import { motion } from "framer-motion";

interface CardTemplateProps {
  header?: string;
  title?: string;
  footer?: string;
  indicator?: string;
  avatar?: string;
  actionR?: ReactElement;
  actionL?: ReactElement;
  isTile?: boolean;
  isSelected?: boolean;
}

const CardTemplate: FC<CardTemplateProps> = ({
  header,
  title,
  footer,
  indicator,
  avatar,
  actionL,
  actionR,
  isTile = false,
  isSelected = false,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Card
      p={2}
      borderRadius={isTile ? 16 : 4}
      minW="14em"
      w="full"
      h="fit-content"
      maxW={isTile ? "20em" : "24em"}
      variant={isTile ? "elevated" : "filled"}
      as={motion.div}
      layout
      onHoverStart={onOpen}
      onHoverEnd={onClose}
      {...(isSelected && { borderWidth: 2 })}
    >
      {indicator && (
        <Indicator
          status={indicator}
          w={isTile ? 6 : 4}
          h={isTile ? 6 : 4}
          position="absolute"
          top={2}
          right={2}
        />
      )}
      <Stack gap={2} direction={isTile ? "column" : "row"} align={"center"}>
        {!isTile && <Avatar size="sm"></Avatar>}
        <VStack
          gap={0}
          mx={isTile ? "auto" : 2}
          w="full"
          fontSize={isTile ? "md" : "xs"}
          align={isTile ? "center" : "start"}
        >
          <Text textColor="gray">{header}</Text>
          <Heading fontSize={isTile ? "3xl" : "md"}>{title}</Heading>
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
