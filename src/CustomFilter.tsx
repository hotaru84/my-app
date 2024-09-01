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
  Heading,
  PopoverHeader,
  Tag,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Icon,
  InputGroup,
  InputRightElement,
  Badge,
  IconButton,
  Progress,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
  TbSearch,
} from "react-icons/tb";
import { Select } from "chakra-react-select";

const results = [
  "success",
  "error",
  "warning"
];

export const CustomFilter: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          icon={<TbFilterEdit />}
          onClick={onOpen}
          isActive
          aria-label={""}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"} right={6}>
          <PopoverHeader>Success filter</PopoverHeader>
          <Progress size='xs' isIndeterminate colorScheme="cyan" />
          <PopoverBody>
            <VStack>
              <FormControl>
                <FormLabel>Data</FormLabel>
                <InputGroup size='md'>
                  <Input placeholder="Search data2..."
                    focusBorderColor="cyan.400"
                  />
                  <InputRightElement>
                    <Icon as={TbSearch} />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl w="full">
                <FormLabel>Success</FormLabel>
                <Select
                  options={results.map((r) => ({ value: r, label: r, colorScheme: 'green' }))}
                  isMulti
                  useBasicStyles
                  placeholder={'Select result..'}
                />
              </FormControl>
            </VStack>
          </PopoverBody>
          <ButtonGroup alignSelf={"end"} p={2}>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan" isDisabled>Apply</Button>
          </ButtonGroup>
        </PopoverContent>
      </Portal>
    </Popover >
  );
};
