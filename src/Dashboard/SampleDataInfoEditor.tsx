import {
  ChangeEventHandler,
  FC,
  useEffect,
  useState,
} from "react";
import {
  Button,
  useDisclosure,
  ButtonGroup,
  IconButton,
  Modal,
  Select,
  ModalContent,
  ModalOverlay,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Flex,
  Input,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbFilterEdit,
  TbFilterPlus,
} from "react-icons/tb";
import { defaultSampleDataFilter, SampleDataFilter, SampleDataInfo, SampleDataTypes } from "./SampleData";

interface Props {
  info: SampleDataInfo;
  onInfoChange: (f: SampleDataInfo) => void;
}
export const SampleDataInfoEditor: FC<Props> = ({ info, onInfoChange }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [draft, setDraft] = useState(info);
  const onChange: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (v) => {
    const datainfo: SampleDataInfo = { ...draft };
    Object.defineProperty(
      datainfo,
      v.target.name,
      {
        value: v.target.value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    setDraft({ ...datainfo });
  }
  const onChangeFilterNum: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (v) => {
    const filter: SampleDataFilter = { ...draft.filter };

    Object.defineProperty(
      filter,
      v.target.name,
      {
        value: Number(v.target.value),
        writable: true,
        enumerable: true,
        configurable: true
      });
    setDraft({ ...draft, filter });
  };
  const onChangeFilterString: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (v) => {
    const filter: SampleDataFilter = { ...draft.filter };
    Object.defineProperty(
      filter,
      v.target.name,
      {
        value: v.target.value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    setDraft({ ...draft, filter });
  };


  const onFilter = (key: string | string[]) => {
    const keys = (!Array.isArray(key) ? [key] : key) as (keyof SampleDataFilter)[];
    const filter: SampleDataFilter = {};

    keys.forEach((k) => {
      Object.defineProperty(filter,
        k,
        {
          value: draft.filter[k] === undefined ? defaultSampleDataFilter[k] : draft.filter[k],
          writable: true,
          enumerable: true,
          configurable: true
        });
    });
    setDraft({ ...draft, filter });
  }
  const FilterBody = (k: string, v: string | number | string[] | number[]) => {
    if (typeof v === 'number') return <Input type="number" defaultValue={v} name={k} onChange={onChangeFilterNum} />;
    if (typeof v === 'string') return <Input value={v} />;
    if (Array.isArray(v)) return <></>;

    return <></>;
  }
  const onApply = () => {
    onInfoChange(draft);
    onClose();
  }

  useEffect(() => {
    console.log(draft);
  }, [draft]);

  return (<>
    <IconButton
      icon={<TbFilterEdit />}
      onClick={onOpen}
      aria-label={""}
      variant={"ghost"}
    />
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={4} gap={2}>
        <FormControl as={Flex}>
          <Select value={draft.type} focusBorderColor="cyan.400" onChange={onChange}>
            {Object.keys(SampleDataTypes).map(v => (<option key={v} value={v}>{v}</option>))}
          </Select>
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel flex="1" htmlFor="title">Title</FormLabel>
          <Input value={draft.title} flex="2" focusBorderColor="cyan.400" name="title" onChange={onChange} />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel flex="1" htmlFor="unit">Unit</FormLabel>
          <Input value={draft.unit} flex="2" focusBorderColor="cyan.400" name="unit" onChange={onChange} />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel flex="1">Filter</FormLabel>
          <Spacer />
          <Menu closeOnSelect={false} size={"sm"}>
            <MenuButton as={IconButton} colorScheme='cyan' variant='ghost' icon={<TbFilterPlus />} />
            <MenuList overflowY={"auto"} maxH="50vh">
              <MenuOptionGroup value={Object.keys(draft.filter)} type='checkbox' onChange={onFilter}>
                {Object.keys(defaultSampleDataFilter)
                  .map(v => (<MenuItemOption key={v} value={v}>{v}</MenuItemOption>))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </FormControl>
        {Object.entries(draft.filter).map(([k, v], i) =>
          <FormControl as={Flex} key={'filter -' + i} ml={4}>
            <FormLabel flex="1" htmlFor={k}>{k}</FormLabel>
            {FilterBody(k, v)}
          </FormControl>
        )}
        <ButtonGroup colorScheme="cyan">
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
