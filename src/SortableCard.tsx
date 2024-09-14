import { Avatar, Card, CardBody } from "@chakra-ui/react";
import { Children, FC } from "react";
import { useList, useRafLoop } from "react-use";
import { useDragSortableItem } from "./useDragSortableItem";
import { motion } from "framer-motion";
import { TbCheck } from "react-icons/tb";

type RectProp = {
  w: number;
  h: number;
  x: number;
  y: number;
  lastUpdateTick: number;
};

interface Props {
  id: string;
  children: React.ReactNode;
}

export const SortableCard: FC<Props> = ({ id, children }) => {
  const { itemProps } = useDragSortableItem(id);

  const onToggle = () => {

  };

  return (
    <Card
      {...itemProps}
      borderRadius={8}
      onClick={onToggle}
      colorScheme="cyan"
      size={"md"}
      aspectRatio={1}
      borderWidth={2}
      borderColor="blue.400"
    >
      <Avatar
        as={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        position="absolute"
        top={-2}
        left={-2}
        bgColor={"blue.400"}
        rounded="full"
        boxSize={4}
        icon={<TbCheck size={12} />}
      />
      {children}
    </Card>
  );
};
