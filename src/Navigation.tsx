import {
  IconButton,
  Spacer,
  useDisclosure,
  Flex,
  Tab,
  TabList,
  Tabs,
  Icon,
} from "@chakra-ui/react";
import {
  TbDeviceMobile,
  TbMenu2,
  TbRoute,
} from "react-icons/tb";
import { DetailDrawer } from "./DetailDrawer";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const LinkItems = [
  { label: "Devices", icon: TbDeviceMobile, to: "/packages" },
  { label: "Process", icon: TbRoute, to: "/dashboard" },
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
      <Spacer />
      <Tabs colorScheme="cyan" variant="soft-rounded">
        <TabList gap={1}>
          {LinkItems.map((link, i) => (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Tab as={NavLink} to={link.to}>
                <Icon as={link.icon} mr={1} />
                {link.label}
              </Tab>
            </motion.div>
          ))}
        </TabList>
      </Tabs>
      <Spacer />
      {DetailDrawer(isOpen, onClose)}
    </Flex>
  );
};
