import {
  HStack,
  Flex,
  Icon,
  VStack,
  Text,
  StatUpArrow,
  StatDownArrow,
  Card,
  Avatar,
  Heading,
  chakra,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { FC } from "react";
import { IconType } from "react-icons";
import { TbEdit } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export interface StatData {
  label: string;
  score: number;
  unit: string;
  color: string;
  icon: IconType;
  isup?: boolean;
  emphasize?: true;
  id: string;
}

const StatCard: FC<StatData> = ({
  label,
  score,
  unit,
  color,
  icon,
  isup,
  emphasize,
  id
}) => {

  return (
    <Card
      rounded={16}
      p={4}
      h="fit-content"
      as={motion.div}
      whileHover={{ filter: "brightness(0.9)" }}
    >
      <HStack align="center" spacing={4}>
        <Avatar
          rounded={16}
          boxSize={16}
          icon={<Icon as={icon} w={10} h={10} color="white" />}
          bgColor={color}
        />
        <VStack align="start" maxW="lg" h="full" spacing={0}>
          <Text fontSize="md" color="gray.400">
            {label}
          </Text>
          <VStack spacing={0}>
            <Heading
              fontSize={{ base: "2xl", md: emphasize ? "5xl" : "4xl" }}
              fontWeight={emphasize ? "bold" : "normal"}
            >
              {isup !== undefined &&
                (isup ? (
                  <StatUpArrow fontSize="md" />
                ) : (
                  <StatDownArrow fontSize="md" />
                ))}
              {score}{" "}
              <chakra.span fontSize="sm" color="gray.400" fontWeight="normal">
                {unit}
              </chakra.span>
            </Heading>
          </VStack>
        </VStack>
      </HStack>
    </Card>
  );
};

export default StatCard;
