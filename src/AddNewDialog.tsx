import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  VStack,
  Text,
  HStack,
  Card,
  Avatar,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { useStepform } from "./useStepform";
import { AnimatePresence, motion } from "framer-motion";

type DeviceRoleProps = {
  name: string;
  type: string;
  index: number;
  role: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface selectDeviceProps {
  dev: DeviceRoleProps;
  onSelect: (device: DeviceRoleProps) => void;
  onCancel: () => void;
}
const SelectDevice: FC<selectDeviceProps> = ({ dev, onSelect }) => {
  return (
    <HStack>
      <Avatar onClick={() => onSelect({ ...dev, type: "eth" })}>eth</Avatar>
      <Card onClick={() => onSelect({ ...dev, type: "eth2" })}>eth2</Card>
      <Card
        onClick={() => onSelect({ ...dev, type: "eth3" })}
        cursor={"pointer"}
      >
        eth3
      </Card>
    </HStack>
  );
};

const SelectRole: FC<selectDeviceProps> = ({ dev, onSelect }) => {
  return (
    <ButtonGroup>
      <Button onClick={() => onSelect({ ...dev, role: "out" })}>out</Button>
      <Button onClick={() => onSelect({ ...dev, role: "in" })}>in</Button>
      <Button onClick={() => onSelect({ ...dev, role: "in2" })}>in2</Button>
    </ButtonGroup>
  );
};

const Setup: FC<selectDeviceProps> = ({ dev }) => {
  // type vs role
  // name
  //eth + out -> dev.eth out
  //eth + in  -> dev.eth telegram collection
  //eth + in2 -> dev.eth telegram trg
  //din + trg
  //din + end

  return (
    <VStack>
      <Text>{dev.type}</Text>
      <Text>{dev.role}</Text>
    </VStack>
  );
};

const AddNewDialog: FC<Props> = ({ isOpen, onClose }) => {
  const [devicerole, setDevicerole] = useState<DeviceRoleProps>({
    name: "device-1",
    type: "eth",
    index: 0,
    role: "",
  });
  const onUpdate = (prop: DeviceRoleProps) => {
    setDevicerole(prop);
    goToNext();
  };

  const onEnd = () => {
    resetStep();
    onClose();
  };

  const { activeForm, goToNext, resetStep } = useStepform([
    <SelectDevice dev={devicerole} onSelect={onUpdate} onCancel={onEnd} />,
    <SelectRole dev={devicerole} onSelect={onUpdate} onCancel={onEnd} />,
    <Setup dev={devicerole} onSelect={onUpdate} onCancel={onEnd} />,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onEnd}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Device</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{activeForm}</ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AddNewDialog;
