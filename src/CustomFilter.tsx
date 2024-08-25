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
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
} from "react-icons/tb";
import { Select } from "chakra-react-select";


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
          isActive={isOpen}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"} right={6}>
          <PopoverArrow />
          <PopoverBody>
            <VStack>
              <FormControl>
                <FormLabel>Success result definition</FormLabel>
              </FormControl>
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
            </VStack>
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
