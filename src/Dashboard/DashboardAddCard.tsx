import {
  FC,
} from "react";
import {
  Button,
  useDisclosure,
  ButtonGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbPlus,
} from "react-icons/tb";
import CardEditForm from "./CardEditForm";

export const DashboardAddCard: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <IconButton
        colorScheme="cyan"
        variant={"ghost"}
        onClick={onOpen}
        icon={<TbPlus />} aria-label={""} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CardEditForm />
          </ModalBody>
          <ButtonGroup colorScheme="cyan" p={4}>
            <Spacer />
            <Button variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button >Add</Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  );
};
