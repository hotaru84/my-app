import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Button,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import { TbEyeEdit, TbInfoCircle, TbMailPin, TbUser } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";

const Menu = [
  { name: "Accounts", icon: <TbUser />, to: "/" },
  { name: "Appearance", icon: <TbEyeEdit />, to: "/" },
  { name: "Maintenance", icon: <TbMailPin />, to: "/" },
  { name: "Info", icon: <TbInfoCircle />, to: "/" },
];

export function DetailDrawer(isOpen: boolean, onClose: () => void) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left" size={"xs"}>
      <DrawerOverlay />
      <DrawerContent w="100px">
        <DrawerCloseButton />
        <DrawerHeader>More..</DrawerHeader>
        <DrawerBody flexDir={"column"}>
          {Menu.map((item, i) => (
            <Button
              key={i}
              as={Link}
              w="full"
              leftIcon={item.icon}
              variant={"ghost"}
              justifyContent="flex-start"
              my={2}
              to={item.to}
            >
              {item.name}
            </Button>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button
            as={NavLink}
            to={"/login"}
            style={{ textDecoration: "none" }}
            role="group"
            w="full"
            colorScheme="primary"
          >
            Log out
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
