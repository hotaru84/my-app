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
  Select,
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
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
} from "react-icons/tb";

export const CustomFilter: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isAdvanced, onToggle: onToggleAdvanced } = useDisclosure();

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
          <PopoverHeader><Tag colorScheme="green">Success definition</Tag></PopoverHeader>
          <PopoverBody>
            <Accordion allowToggle defaultIndex={0} minW={'300px'}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      Package
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FormControl>
                    <FormLabel textColor={"GrayText"}>Results</FormLabel>
                    <Select focusBorderColor="cyan.400" w="auto" >
                      <option>Success</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel textColor={"GrayText"}>Output data</FormLabel>
                    <Input focusBorderColor="cyan.400" w="auto" placeholder="Format" />
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      Detail
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>

                  <FormControl>
                    <FormLabel textColor={"GrayText"}>codes</FormLabel>
                    <Select focusBorderColor="cyan.400" w="auto" >
                      <option></option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel textColor={"GrayText"}>scanners</FormLabel>
                    <Select focusBorderColor="cyan.400" w="auto" >
                      <option></option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel textColor={"GrayText"}>Analytics result</FormLabel>
                    <Select focusBorderColor="cyan.400" w="auto" >
                      <option></option>
                    </Select>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </PopoverBody>
          <ButtonGroup alignSelf={"end"} p={2}>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan">Apply</Button>
          </ButtonGroup>
        </PopoverContent>
      </Portal>
    </Popover >
  );
};
