import {
  ChangeEvent,
  FC,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  OnDateSelected,
  RangeCalendarPanel,
  RangeDatepicker,
  SingleDatepicker,
} from "chakra-dayzed-datepicker";
import {
  Button,
  Select,
  Text,
  InputGroup,
  InputLeftAddon,
  useDisclosure,
  VStack,
  Collapse,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  InputLeftElement,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  ButtonGroup,
  NumberInputField,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Box,
  Center,
  Icon,
  Input,
} from "@chakra-ui/react";
import {
  compareAsc,
  endOfDay,
  endOfToday,
  format,
  getHours,
  parse,
  startOfDay,
  startOfToday,
} from "date-fns";
import "rc-time-picker/assets/index.css";
import { TbArrowDown, TbCalendarSearch, TbChevronDown } from "react-icons/tb";

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
  maxDays?: number;
  onChange: (start?: Date, end?: Date) => void;
}

const RangeCalendar: FC<RangeCalendarProps> = ({
  startDate,
  endDate,
  maxDays = 7,
  onChange,
}) => {
  const handleOnDateSelected: OnDateSelected = ({ date }) => {
    if (startDate && endDate) onChange(startOfDay(date), undefined); //reset
    else if (!startDate) onChange(startOfDay(date), undefined); // first
    else if (!endDate) {
      if (compareAsc(endOfDay(date), startDate) > 0)
        onChange(startDate, endOfDay(date)); // update
      else onChange(startOfDay(date), endOfDay(startDate)); // swap
    }
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
  setDate: (date?: Date) => void;
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
    <InputGroup size="sm">
      <InputLeftAddon borderLeftRadius={8}>
        {date && format(date, "yyyy-MM-dd")}
      </InputLeftAddon>
      <Input
        type="time"
        borderRadius={8}
        value={date ? format(date, "HH:mm") : ""}
        focusBorderColor="cyan.400"
        pattern="[0-9]{2}:[0-9]{2}"
        isDisabled={!date}
        onChange={onChangeTime}
        w="fit-content"
      />
    </InputGroup>
  );
};

interface SelectOption {
  label: string;
  value: string;
  panel?: ReactElement;
}
const CustomPanel: FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(startOfToday());
  const [endDate, setEndDate] = useState<Date | undefined>(endOfToday());

  const onChangeDate = (start?: Date, end?: Date) => {
    if (start && end) {
      const asc = compareAsc(end, start) > 0;
      setStartDate(asc ? start : end);
      setEndDate(asc ? end : start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <VStack w="full">
      <RangeCalendar
        startDate={startDate}
        endDate={endDate}
        onChange={onChangeDate}
      />
      <HStack>
        <TimePicker
          date={startDate}
          setDate={(d) => onChangeDate(d, endDate)}
        />
        <TimePicker
          date={endDate}
          setDate={(d) => onChangeDate(startDate, d)}
        />
      </HStack>
    </VStack>
  );
};

const options: SelectOption[] = [
  {
    label: "Last hour",
    value: "-1h",
  },
  {
    label: "Last day",
    value: "-1d",
  },
  {
    label: "Last week",
    value: "-1w",
  },
  {
    label: "Custom",
    value: "custom",
    panel: <CustomPanel />,
  },
];

export const DateTimeRangePicker: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={<TbCalendarSearch />}
        variant="ghost"
        colorScheme="cyan"
        onClick={onOpen}
      >
        Filter
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Tabs orientation="vertical" colorScheme="cyan" align="start">
              <TabList>
                {options.map((op) => (
                  <Tab
                    w="fit-content"
                    textAlign="start"
                    key={op.value}
                    isTruncated
                  >
                    {op.label}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                <CustomPanel />
              </TabPanels>
            </Tabs>
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
