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
  Input,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbPlus,
} from "react-icons/tb";
import { MultipleSelect, SingleSelect } from "../multipleSelect";

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
            <MultipleSelect selectableItems={[
              {
                value: "a",
                label: "a"
              },
              {
                value: "b",
                label: "b"
              }
            ]}
              onSelect={(e) => console.log(e)}
            />
            <SingleSelect selectableItems={[
              {
                value: "a",
                label: "a"
              },
              {
                value: "b",
                label: "b"
              }
            ]}
              onSelect={(e) => console.log(e)}
            />
            <Input type="color" value="#68D391ee" onChange={(e) => console.log(e.currentTarget.value)} />
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
