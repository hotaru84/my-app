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
  Box,
  Icon,
} from "@chakra-ui/react";
import { FC, ReactElement, useMemo } from "react";
import { TbCheck, TbDotsVertical } from "react-icons/tb";
import { Indicator } from "./Indicator";
import { AnimatePresence, motion } from "framer-motion";

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
  isDisabled?: boolean;
  onClick?: () => void;
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
  isDisabled = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ filter: "brightness(0.9)", scale: 0.9 }}
      onClick={onClick}
      layout
    >
      <Card
        p={2}
        borderRadius={isTile ? 16 : 4}
        minW="12em"
        w="full"
        h="fit-content"
        maxW={isTile ? "20em" : "22em"}
        variant={isTile ? "elevated" : "filled"}
        filter={isDisabled ? "blur(3px)" : undefined}
        {...(isSelected && {
          borderWidth: 2,
          borderColor: "blue.300",
        })}
      >
        <AnimatePresence>
          {isSelected && (
            <Avatar
              as={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              position="absolute"
              top={-2}
              left={-2}
              bgColor={"blue.300"}
              rounded="full"
              boxSize={4}
              icon={<TbCheck size={12} />}
            />
          )}
        </AnimatePresence>
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
    </motion.div>
  );
};
export default CardTemplate;
