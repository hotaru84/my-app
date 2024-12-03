import {
  FC,
  useCallback,
  useMemo,
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
  list: T[],
  push: (...v: T[]) => void;
  updateAt: (i: number, v: T) => void;
  getAt: (i: number) => T;
  getKeysAt: (i: number) => string[];
  save: () => void;
  len: number;
  requiredkeys: (keyof T)[];
  nonRequiredkeys: (keyof T)[];
}

export function useObjectAcccessor<T extends object>(storedName: string, defaultFull: T, defaultRequired: T): ObjectAcccessor<T> {
  const [storedList, store] = useLocalStorage<T[]>(storedName);
  const [list, { push, updateAt }] = useList<T>(storedList !== undefined ? storedList : []);

  const getAt = useCallback((i: number) => list[i], [list]);
  const getKeysAt = useCallback((i: number) => Object.keys(list[i]), [list]);
  const len = useMemo(() => list.length, [list.length]);
  const save = useCallback(() => store(list), [list, store]);
  const requiredkeys = useMemo(() => Object.keys(defaultRequired) as (keyof T)[], [defaultRequired]);
  const nonRequiredkeys = useMemo(() => (Object.keys(defaultFull) as (keyof T)[]).filter(k => !requiredkeys.includes(k)), [defaultFull, requiredkeys]);

  return {
    list,
    push,
    updateAt,
    getAt,
    getKeysAt,
    len,
    save,
    requiredkeys,
    nonRequiredkeys,
  }
}

export const CustomFilter: FC = () => {
  const { list, push, updateAt, len, getAt, save, nonRequiredkeys, requiredkeys } = useObjectAcccessor('filter-list', defaultCardFilter, defaultCardFilterRequired);
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
    nonRequiredkeys.forEach((k) => {
      const filter = { t }
      Object.defineProperty(filter,
        k,
        {
          value: getAt(index)[k] === undefined ? defaultCardFilter[k] : getAt(index)[k],
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
                        <MenuOptionGroup value={Object.keys(f)} type='checkbox' onChange={(v) => changeFilter(i, v)}>
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
