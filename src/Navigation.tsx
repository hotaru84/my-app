import {
  IconButton,
  Spacer,
  useDisclosure,
  Flex,
  Divider,
  Tab,
  TabList,
  Tabs,
  Icon,
  theme,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  TbDashboard,
  TbDeviceMobile,
  TbMenu2,
  TbRoute,
  TbSettings,
} from "react-icons/tb";
import NavMenuItem from "./MenuButton";
import { DetailDrawer } from "./DetailDrawer";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const LinkItems = [
  { label: "Devices", icon: TbDeviceMobile, to: "/packages" },
  { label: "Process", icon: TbRoute, to: "/dashboard" },
];

export const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w="full"
      align={"center"}
      bgColor={"bg"}
      p={2}
      gap={2}
      position={"absolute"}
      top={0}
    >
      <IconButton
        aria-label="menu"
        variant={"ghost"}
        icon={<TbMenu2 />}
        rounded={8}
        size="lg"
        onClick={onOpen}
        colorScheme="gray"
      />
      <Tabs colorScheme="cyan" variant="soft-rounded">
        <TabList gap={1}>
          {LinkItems.map((link, i) => (
            <Tab as={NavLink} to={link.to}>
              <Icon as={link.icon} mr={1} />
              {link.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {DetailDrawer(isOpen, onClose)}
    </Flex>
  );
};
