import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface ItemProps {
  label: string;
  icon: IconType;
  isselect: boolean;
  dots?: string;
  variant?: string;
  onClick: () => void;
}

export default function Index(props: ItemProps) {
  const scale = {
    initial: { scale: 1 },
    animate: { scale: 1.2 },
  };
  const dots = {
    content: "''",
    position: "absolute",
    display: "block",
    boxSize: props.dots ? "14px" : "",
    marginLeft: "60%",
    marginBottom: "50%",
    borderRadius: "50%",
    bgColor: props.dots,
    boxShadow: "sm",
  };
  const hoverFilter = useColorModeValue("brightness(90%)", "brightness(150%)");
  return (
    <motion.div initial="initial" animate="initial" whileHover="animate">
      <Flex
        py={2}
        role="group"
        textAlign={"center"}
        onClick={props.onClick}
        direction={"column"}
      >
        <motion.div variants={scale}>
          <IconButton
            icon={<props.icon />}
            w={14}
            h={10}
            py={2}
            fontWeight={"light"}
            fontSize={"2xl"}
            textColor={props.isselect ? "white" : "text"}
            colorScheme={props.isselect ? "teal" : "unset"}
            borderRadius={"full"}
            variant={props.variant}
            aria-label={props.label}
            _groupHover={{ filter: hoverFilter }}
            _after={dots}
          />
        </motion.div>
        <Text fontSize={"sm"} fontWeight={"normal"}>
          {props.label}
        </Text>
      </Flex>
    </motion.div>
  );
}
