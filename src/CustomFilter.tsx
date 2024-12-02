import {
  FC,
} from "react";
import {
  Button,
  useDisclosure,
  ButtonGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Editable,
  EditablePreview,
  EditableInput,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  VStack,
  HStack,
  Box,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
  TbFilterPlus,
  TbPlus,
} from "react-icons/tb";
import { CardFilter, CardValueTypeList, RangeFilterProps } from "./Dashboard/CardConfig";
import { useList } from "react-use";

export const CustomFilter: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [filters, { push, updateAt }] = useList<CardFilter>([])
  const addNew = () => {
    push({
      title: `filter-${filters.length + 1}`
    });
  };
  const changeTitle = (index: number, value: string) => {
    updateAt(index, { ...filters[index], title: value });
  };

  const changeFilter = (index: number, key: string | string[]) => {
    const filter = filters[index];
    const keys = !Array.isArray(key) ? [key] : key;
    const rangefilter: RangeFilterProps = { min: 0, max: 100, isNot: false };
    const nums: number[] = [0, 0];

    keys.forEach((k: string) => {
      if (k === 'codeCfg' || k === 'resultCode' || k === 'errorCode' || k === 'units') {
        filter[k] = nums;
      } else if (k === 'title' || k === 'outdata' || k === 'comment') {
      } else {
        filter[k] = rangefilter;
      }
    });
    updateAt(index, filter);
  }

  return (<>
    <IconButton
      icon={<TbFilterEdit />}
      onClick={onOpen}
      aria-label={""}
    />
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Customize Filter</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion allowToggle>
            {filters.map((f, i) => <AccordionItem key={'filter -' + i}>
              <AccordionButton>
                <Editable value={f.title} onChange={(v) => changeTitle(i, v)}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack>
                  <HStack w="full">
                    <Spacer />
                    <Menu closeOnSelect={false}>
                      <MenuButton as={Button} colorScheme='cyan' leftIcon={<TbFilterPlus />}>
                        Filter type
                      </MenuButton>
                      <MenuList>
                        <MenuDivider />
                        <MenuOptionGroup title='Country' type='checkbox' onChange={(v) => changeFilter(i, v)}>
                          {CardValueTypeList.map(v => (<MenuItemOption value={v}>{v}</MenuItemOption>))}
                        </MenuOptionGroup>
                      </MenuList>
                    </Menu>
                  </HStack>
                  {Object.entries(f).map((e, j) => <Box key={"element-" + i + j}>
                    {e[0]}
                  </Box>)}
                </VStack>
              </AccordionPanel>
            </AccordionItem>)}
          </Accordion>
        </ModalBody>
        <ButtonGroup colorScheme="cyan" p={4}>
          <Button onClick={addNew} leftIcon={<TbPlus />}>Add New</Button>
          <Spacer />
          <Button variant='ghost' onClick={onClose}>
            Close
          </Button>
          <Button >Add</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  </ >
  );
};
