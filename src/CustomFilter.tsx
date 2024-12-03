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
import { useList, useLocalStorage } from "react-use";

export interface ObjectAcccessor<T> {
  push: (...v: T[]) => void;
  updateAt: (i: number, v: T) => void;
  get: (i: number) => T;
  len: number;
  save: () => void;
  keys: string[];
}

export function useObjectAcccessor<T>(storedName: string, defaultFull: T, defaultRequired: T) {
  const [storedList, save] = useLocalStorage<T[]>(storedName);
  const [list, { push, updateAt }] = useList<T>(storedList !== undefined ? storedList : []);

  return {
    push,
    updateAt,
    get: (i: number) => list[i],
    len: list.length,
    save: () => save(list),
    keys: Object.keys(defaultFull),
  }
}

export const CustomFilter: FC = () => {
  const [savedFilters, saveFilters] = useLocalStorage<CardFilter[]>('filter-list');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [filters, { push, updateAt }] = useList<CardFilter>(savedFilters !== undefined ? savedFilters : []);
  const addNew = () => {
    push({
      title: `filter-${filters.length + 1}`
    });
  };
  const changeTitle = (index: number, value: string) => {
    updateAt(index, { ...filters[index], title: value });
  };

  const changeFilter = (index: number, key: string | string[]) => {
    const keys = (!Array.isArray(key) ? [key] : key) as (keyof CardFilter)[];
    const filter: CardFilter = defaultCardFilterRequired;

    keys.forEach((k) => {
      Object.defineProperty(filter,
        k,
        {
          value: filters[index][k] === undefined ? defaultCardFilter[k] : filters[index][k],
          writable: true,
          enumerable: true,
          configurable: true
        });
    });
    updateAt(index, filter);
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
    saveFilters(filters);
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
                        <MenuOptionGroup defaultValue={Object.keys(f)} type='checkbox' onChange={(v) => changeFilter(i, v)}>
                          {Object.keys(defaultCardFilter).filter(k => k !== 'title').map(v => (<MenuItemOption key={v} value={v}>{v}</MenuItemOption>))}
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
