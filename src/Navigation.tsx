import {
  IconButton,
  Spacer,
  useDisclosure,
  Flex,
  Tab,
  TabList,
  Tabs,
  Icon,
  Tag,
  HStack,
  Box,
  TagLeftIcon,
  chakra,
  Button,
} from "@chakra-ui/react";
import {
  TbCheck,
  TbDashboard,
  TbDeviceMobile,
  TbGalaxy,
  TbMenu2,
  TbRoute,
} from "react-icons/tb";
import { DetailDrawer } from "./DetailDrawer";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import TrendlineChart from "./TrendlineChart";
import { DateTimeRangePicker } from "./DateTimeRangePicker";

const LinkItems = [
  { label: "Dashboard", icon: <TbDashboard />, to: "/dashboard" },
  { label: "Gallery", icon: <TbGalaxy />, to: "/gallery" },
];

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
      <ColorModeSwitcher />
      <Spacer />
      <Tag colorScheme={"green"}>
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
      <DateTimeRangePicker />
      {LinkItems.map((link, i) => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <IconButton aria-label={link.label} icon={link.icon} as={NavLink} to={link.to} />
        </motion.div>
      ))}
      {DetailDrawer(isOpen, onClose)}
    </Flex>
  );
};
