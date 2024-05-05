import { IconButton, Spacer, useDisclosure, Flex } from "@chakra-ui/react";
import {
  TbDashboard,
  TbDeviceMobile,
  TbMenu2,
  TbSettings,
} from "react-icons/tb";
import NavMenuItem from "./MenuButton";
import { DetailDrawer } from "./DetailDrawer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LinkItems = [
  { label: "Dashboard", icon: TbDashboard, to: "/dashboard" },
  { label: "Packages", icon: TbDeviceMobile, to: "/packages" },
  { label: "System", icon: TbSettings, to: "/system" },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        w={{ base: "full", md: "100px" }}
        h={{ base: "80px", md: "full" }}
        direction={{ base: "row", sm: "column" }}
        align={{ base: "center", sm: "center" }}
        gap={{ base: 8, md: 0 }}
        bgColor={"bg"}
      >
        <IconButton
          fontSize={24}
          aria-label="menu"
          variant={"ghost"}
          icon={<TbMenu2 />}
          rounded="full"
          onClick={onOpen}
          px={4}
          m="12px"
          colorScheme="gray"
        />
        <Spacer />
        {LinkItems.map((link, i) => (
          <NavMenuItem
            key={i}
            isselect={select === i}
            {...link}
            onClick={() => {
              setSelect(i);
              navigate(link.to);
            }}
          />
        ))}
        <Spacer />
      </Flex>
      {DetailDrawer(isOpen, onClose)}
    </>
  );
};
