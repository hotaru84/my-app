import { FC, useState } from "react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import DateTimePicker from "react-datetime-picker";
import { Value } from "react-datetime-picker/dist/cjs/shared/types";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

export const DatePickerPopover: FC = () => {
  const [value, onChange] = useState<Value>(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button onClick={onOpen}>Trigger</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <Switch />
          </PopoverHeader>
          <PopoverBody>
            <DateTimePicker onChange={onChange} value={value} />
          </PopoverBody>
          <PopoverFooter>
            <Button onClick={onClose}>Apply</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
