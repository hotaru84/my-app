import {
  FC,
  useCallback,
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
  Select,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
  TbFilterPlus,
  TbPlus,
} from "react-icons/tb";
import { CardFilter, defaultCardFilter, defaultCardFilterRequired } from "./Dashboard/CardConfig";
import { useObjectAcccessor } from "./Dashboard/useObjectAccessor";


export const CustomFilter: FC = () => {
  const {
    list, push, updateAt, len, getAt, save, updateKeysAt,
    getKeysAt, nonRequiredkeys,
  } = useObjectAcccessor<CardFilter>(
    'filter-list',
    defaultCardFilter,
    defaultCardFilterRequired);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addNew = () => {
    push({
      title: `filter-${len + 1}`
    });
  };
  const changeTitle = (index: number, value: string) => {
    updateAt(index, { ...getAt(index), title: value });
  };

  const changeFilter = (index: number, key: string | string[]) => {
    updateKeysAt(index, key);
  }

  const renderFilterConfigs = useCallback((f: CardFilter) => {
    return <VStack>
      {f.resultCode && <Select>
        <option>r-1</option>
        <option>r-1</option>
        <option>r-1</option>
      </Select>}
      {f.codeCfg && <Select>
        <option>c-1</option>
        <option>c-1</option>
        <option>c-1</option>
      </Select>}
      {f.errorCode && <Select>
        <option>e-1</option>
        <option>e-1</option>
        <option>e-1</option>
      </Select>}

    </VStack>
  }, []);

  const onApply = () => {
    save();
    onClose();
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
            {list.map((f, i) => <AccordionItem key={'filter -' + i}>
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
                        <MenuOptionGroup value={getKeysAt(i)} type='checkbox' onChange={(v) => changeFilter(i, v)}>
                          {nonRequiredkeys.filter(k => k !== 'title').map(v => (<MenuItemOption key={v} value={v}>{v}</MenuItemOption>))}
                        </MenuOptionGroup>
                      </MenuList>
                    </Menu>
                  </HStack>
                  {renderFilterConfigs(f)}
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
          <Button onClick={onApply}>Apply</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  </ >
  );
};
