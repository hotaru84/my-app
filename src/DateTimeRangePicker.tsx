import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { OnDateSelected, RangeCalendarPanel } from "chakra-dayzed-datepicker";
import {
  Button,
  InputGroup,
  useDisclosure,
  VStack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverFooter,
  Portal,
  Icon,
  InputLeftAddon,
} from "@chakra-ui/react";
import {
  compareAsc,
  endOfDay,
  endOfToday,
  format,
  parse,
  startOfDay,
  startOfToday,
} from "date-fns";
import "rc-time-picker/assets/index.css";
import { TbArrowRight, TbCalendarSearch } from "react-icons/tb";

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
    width: "20rem",
    variants: "filled",
    focusBorderColor: "cyan.400",
  },
  triggerIconBtnProps: {
    colorScheme: "cyan",
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

const CustomRangeCalendar: FC<RangeCalendarProps> = ({
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
        dateFormat: "yyyy/MM/dd",
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
        {date ? format(date, "MM-dd") : "-----"}
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

interface TabOption {
  label: string;
  value: string;
}

const tabs: TabOption[] = [
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
  },
];

export const DateTimeRangePicker: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom">
      <PopoverTrigger>
        <Button
          leftIcon={<TbCalendarSearch />}
          variant="ghost"
          colorScheme="cyan"
          fontWeight={"normal"}
          size={"sm"}
          onClick={onOpen}
        >
          {startDate && format(startDate, "yyyy/MM/dd")}
          <Icon as={TbArrowRight} mx={2} />
          {endDate && format(endDate, "yyyy/MM/dd")}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"}>
          <PopoverArrow />
          <PopoverBody>
            <Tabs orientation="vertical" colorScheme="cyan" align="start">
              <TabList>
                {tabs.map((op) => (
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
                <VStack w="full">
                  <VStack w="full">
                    <CustomRangeCalendar
                      startDate={startDate}
                      endDate={endDate}
                      onChange={onChangeDate}
                    />
                    <HStack textAlign={"center"}>
                      <TimePicker
                        date={startDate}
                        setDate={(d) => onChangeDate(d, endDate)}
                      />
                      <Icon as={TbArrowRight} mx={2} />
                      <TimePicker
                        date={endDate}
                        setDate={(d) => onChangeDate(startDate, d)}
                      />
                    </HStack>
                  </VStack>
                </VStack>
              </TabPanels>
            </Tabs>
          </PopoverBody>
          <PopoverFooter>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan">Apply</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
