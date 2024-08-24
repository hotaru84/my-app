import {
  FC,
  useState,
} from "react";
import {
  Button,
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  ButtonGroup,
  Input,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
} from "react-icons/tb";


export const CustomFilter: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  type PickMode = "-1h" | "lastd" | "lastw" | "custom";
  const [pickMode, setPickMode] = useState<PickMode>("lastd");
  const modes: { value: PickMode; label: string }[] = [
    { value: "-1h", label: "Last Hour" },
    { value: "lastd", label: "Last Day" },
    { value: "lastw", label: "Last Week" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom">
      <PopoverTrigger>
        <Button
          leftIcon={<TbFilterEdit />}
          onClick={onOpen}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"} right={6}>
          <PopoverArrow />
          <PopoverBody>
            <Input focusBorderColor="cyan.400" w="auto" placeholder="search" />
            {/** 
             * result
             *  code
             *  analysis result
             *  output data
             * settings
             *  code
             *  scanner
             */}
          </PopoverBody>
          <ButtonGroup alignSelf={"end"} p={2}>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan">Apply</Button>
          </ButtonGroup>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
