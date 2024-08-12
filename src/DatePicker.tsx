import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { OnDateSelected, RangeCalendarPanel } from "chakra-dayzed-datepicker";
import {
  Box,
  Button,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
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
  VStack,
  Collapse,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Center,
} from "@chakra-ui/react";
import {
  addDays,
  addHours,
  compareAsc,
  differenceInCalendarDays,
  endOfDay,
  format,
  parse,
  startOfDay,
} from "date-fns";
import "rc-time-picker/assets/index.css";
import { motion } from "framer-motion";

const Month_Names_Short = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const Weekday_Names_Short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calenderStyleProps = {
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      borderColor: "cyan.300",
      _hover: {
        background: "cyan.300",
      },
    },
    isInRangeBtnProps: {
      background: "cyan.200",
    },
    selectedBtnProps: {
      background: "cyan.200",
    },
    todayBtnProps: {
      borderWidth: 1,
      borderColor: "gray.400",
    },
  },
  inputProps: {
    size: "sm",
    variants: "fill",
  },
  calendarPanelProps: {
    wrapperProps: {
      borderColor: "cyan",
    },
    contentProps: {
      borderWidth: 0,
    },
    headerProps: {
      padding: "5px",
    },
    dividerProps: {
      display: "none",
    },
  },
  weekdayLabelProps: {
    fontWeight: "normal",
  },
  dateHeadingProps: {
    fontWeight: "semibold",
  },
};

interface RangeCalendarProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (start?: Date, end?: Date) => void;
}

const RangeCalendar: FC<RangeCalendarProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleOnDateSelected: OnDateSelected = ({ date }) => {
    if (startDate && endDate) onChange(startOfDay(date), undefined);
    else if (!startDate) onChange(startOfDay(date), undefined);
    else if (!endDate) onChange(startDate, endOfDay(date));
    else onChange(startOfDay(date), undefined);
  };
  const dates = useMemo(() => {
    let d = [];
    if (startDate) d.push(startDate);
    if (endDate) d.push(endDate);
    return d.sort(compareAsc);
  }, [endDate, startDate]);

  return (
    <RangeCalendarPanel
      selected={dates}
      dayzedHookProps={{
        onDateSelected: handleOnDateSelected,
        selected: dates,
        monthsToDisplay: 1,
        minDate: endDate ? undefined : startDate,
        maxDate: endDate
          ? undefined
          : startDate
          ? addDays(startDate, 7)
          : undefined,
      }}
      configs={{
        dateFormat: "MM/dd/yyyy",
        monthNames: Month_Names_Short,
        dayNames: Weekday_Names_Short,
        firstDayOfWeek: 0,
      }}
      propsConfigs={calenderStyleProps}
    />
  );
};

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
  label?: string;
}

const TimePicker: FC<TimePickerProps> = ({ date, setDate, label }) => {
  const onChangeTime = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const time = e.currentTarget.value;
      if (date) {
        setDate(parse(time, "HH:mm", date));
      }
    },
    [date, setDate]
  );

  return (
    <Collapse in={date !== undefined}>
      <VStack gap={2} align={"start"} p={2}>
        {label && (
          <Text textColor="grayText" fontSize={"sm"}>
            {label}
          </Text>
        )}
        <InputGroup size="sm">
          <InputLeftAddon borderLeftRadius={8}>
            {date && format(date, "MM-dd")}
          </InputLeftAddon>
          <Input
            type="time"
            borderRadius={8}
            value={date ? format(date, "HH:mm") : ""}
            focusBorderColor="cyan.400"
            pattern="[0-9]{2}:[0-9]{2}"
            isDisabled={!date}
            onChange={onChangeTime}
          />
        </InputGroup>
      </VStack>
    </Collapse>
  );
};

export const DatePickerPopover: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const onChangeDate = (start?: Date, end?: Date) => {
    setStartDate(start);
    if ((start && end && compareAsc(end, start) > 0) || !end) setEndDate(end);
  };

  return (
    <>
      <Button onClick={onOpen}>Trigger</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>
            {startDate &&
              endDate &&
              differenceInCalendarDays(endDate, startDate) + 1}
            Days
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <VStack>
              <RangeCalendar
                startDate={startDate}
                endDate={endDate}
                onChange={onChangeDate}
              />
              <HStack gap={2}>
                <TimePicker
                  label="From:"
                  date={startDate}
                  setDate={setStartDate}
                />
                <TimePicker label="To:" date={endDate} setDate={setEndDate} />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan">Apply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
