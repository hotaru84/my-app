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
        w={"100px"}
        h={"full"}
        direction={"column"}
        align={"center"}
        gap={0}
        bgColor={"bg"}
        overflowY={"auto"}
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
