import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OnDateSelected, RangeCalendarPanel } from "chakra-dayzed-datepicker";
import {
  Button,
  InputGroup,
  useDisclosure,
  VStack,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  Icon,
  InputLeftAddon,
  ButtonGroup,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import {
  addDays,
  addHours,
  addMonths,
  compareAsc,
  endOfDay,
  endOfToday,
  format,
  parse,
  startOfDay,
  startOfToday,
} from "date-fns";
import "rc-time-picker/assets/index.css";
import {
  TbArrowLeft,
  TbArrowRight,
  TbCalendarEvent,
  TbCalendarSearch,
  TbCalendarX,
} from "react-icons/tb";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { PropsConfigs } from "chakra-dayzed-datepicker/dist/utils/commonTypes";
import { useCounter, useObservable } from "react-use";

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
const calenderStyleProps: PropsConfigs = {
  dayOfMonthBtnProps: {
    defaultBtnProps: {
      borderColor: "cyan.300",
      _dark: {
        borderColor: "cyan.400",
      },
      _hover: {
        background: "cyan.300",
        _dark: {
          background: "cyan.400",
        },
      },
    },
    isInRangeBtnProps: {
      background: "cyan.200",
      _dark: {
        background: "cyan.700",
      },
    },
    selectedBtnProps: {
      background: "cyan.400",
      _dark: {
        background: "cyan.400",
      },
    },
    todayBtnProps: {
      borderWidth: 1,
      borderColor: "cyan.400",
      _dark: {
        borderColor: "cyan.600",
      },
    },
  },
  calendarPanelProps: {
    wrapperProps: {
      borderColor: "cyan",
    },
    contentProps: {
      borderWidth: 0,
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
    display: "none",
  },
  dateNavBtnProps: {
    display: "none",
  },
};

interface RangeCalendarProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (start?: Date, end?: Date) => void;
  isDisabled?: boolean;
}

const RangeCalendar: FC<RangeCalendarProps> = ({
  startDate,
  endDate,
  onChange,
  isDisabled = false,
}) => {
  const [offset, { inc, dec, reset, set: setOffset }] = useCounter(0);
  const handleOnDateSelected: OnDateSelected = ({ date }) => {
    if (isDisabled) return;
    else if (startDate && endDate)
      onChange(startOfDay(date), undefined); //reset
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

  useEffect(() => (isDisabled ? reset() : undefined), [isDisabled, reset]);

  return (
    <VStack>
      <ButtonGroup variant={"ghost"} colorScheme="cyan" >
        <IconButton
          aria-label="decy"
          onClick={() => dec(12)}
          icon={<MdKeyboardDoubleArrowLeft />}
        />
        <IconButton
          aria-label="dec"
          onClick={() => dec()}
          icon={<MdKeyboardArrowLeft />}
        />
        <Text my="auto" fontWeight={"bold"}>
          {format(addMonths(startOfToday(), offset), "yyyy-MM")}
        </Text>
        <IconButton
          aria-label="inc"
          onClick={() => dec()}
          icon={<MdKeyboardArrowRight />}
        />
        <IconButton
          aria-label="incy"
          onClick={() => inc(12)}
          icon={<MdKeyboardDoubleArrowRight />}
        />
        <IconButton
          aria-label="dec"
          position={"absolute"}
          right={2}
          isDisabled={offset === 0}
          onClick={() => reset()}
          icon={<TbCalendarEvent />}
        />
      </ButtonGroup>
      <RangeCalendarPanel
        selected={dates}
        dayzedHookProps={{
          onDateSelected: handleOnDateSelected,
          selected: dates,
          offset: offset,
          onOffsetChanged: setOffset,
          monthsToDisplay: 1,
          minDate: isDisabled ? startDate : undefined,
          maxDate: isDisabled ? endDate : undefined,
        }}
        configs={{
          dateFormat: "yyyy/MM/dd",
          monthNames: Month_Names_Short,
          dayNames: Weekday_Names_Short,
          firstDayOfWeek: 0,
        }}
        propsConfigs={calenderStyleProps}
      />
      <HStack textAlign={"center"} gap={0}>
        <TimePicker
          date={startDate}
          setDate={(d) => onChange(d, endDate)}
          isDisabled={isDisabled}
        />
        <Icon as={TbArrowRight} mx={2} />
        <TimePicker
          date={endDate}
          setDate={(d) => onChange(startDate, d)}
          isDisabled={isDisabled}
        />
      </HStack>
    </VStack>
  );
};

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date?: Date) => void;
  label?: string;
  isDisabled?: boolean;
}

const TimePicker: FC<TimePickerProps> = ({
  date,
  setDate,
  label,
  isDisabled = false,
}) => {
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
        isDisabled={!date || isDisabled}
        onChange={onChangeTime}
        w="fit-content"
      />
    </InputGroup>
  );
};

export const DateTimeRangePicker: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  type PickMode = "-1h" | "lastd" | "lastw" | "custom";
  const [pickMode, setPickMode] = useState<PickMode>("lastd");
  const [startDate, setStartDate] = useState<Date | undefined>(startOfToday());
  const [endDate, setEndDate] = useState<Date | undefined>(endOfToday());
  const modes: { value: PickMode; label: string }[] = [
    { value: "-1h", label: "Last Hour" },
    { value: "lastd", label: "Last Day" },
    { value: "lastw", label: "Last Week" },
    { value: "custom", label: "Custom Range" },
  ];
  const onChangePickMode = (mode: PickMode) => {
    const now = new Date();
    switch (mode) {
      case "-1h":
        setStartDate(addHours(now, -1));
        setEndDate(now);
        break;
      case "lastd":
        setStartDate(startOfToday());
        setEndDate(endOfToday());
        break;
      case "lastw":
        setStartDate(addDays(startOfToday(), -6));
        setEndDate(endOfToday());
        break;
      case "custom":
        break;
    }

    setPickMode(mode);
  };
  const pickerBtnLabel = () => {
    switch (pickMode) {
      case "custom":
        return (
          <>
            {startDate && format(startDate, "yyyy/MM/dd")}
            <Icon as={TbArrowRight} mx={2} />
            {endDate ? format(endDate, "yyyy/MM/dd") : "----/--/---"}
          </>
        );
      default:
        return modes.find((m) => m.value === pickMode)?.label;
    }
  };
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
          onClick={onOpen}
          isActive={isOpen}
        >
          {pickerBtnLabel()}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"}>
          <PopoverArrow />
          <PopoverBody>
            <HStack w="full" align={"start"}>
              <ButtonGroup
                orientation="vertical"
                variant={"ghost"}
                colorScheme="cyan"
                size={"sm"}
              >
                {modes.map((mode) => (
                  <Button
                    key={mode.value}
                    justifyContent={"start"}
                    isActive={pickMode === mode.value}
                    onClick={() => onChangePickMode(mode.value)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </ButtonGroup>
              <RangeCalendar
                startDate={startDate}
                endDate={endDate}
                onChange={onChangeDate}
                isDisabled={pickMode !== "custom"}
              />
            </HStack>
          </PopoverBody>
          <ButtonGroup alignSelf={"end"} p={2}>
            <Button variant="ghost" colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="cyan">Apply</Button>
          </ButtonGroup>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
