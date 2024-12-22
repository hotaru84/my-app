import {
  FC,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OnDateSelected, RangeCalendarPanel } from "chakra-dayzed-datepicker";
import {
  Button,
  useDisclosure,
  VStack,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  Icon,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  compareAsc,
  endOfDay,
  endOfToday,
  format,
  startOfDay,
  startOfToday,
  startOfTomorrow,
} from "date-fns";
import "rc-time-picker/assets/index.css";
import {
  TbArrowRight,
  TbCalendarEvent,
  TbCalendarSearch,
} from "react-icons/tb";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { PropsConfigs } from "chakra-dayzed-datepicker/dist/utils/commonTypes";
import { useCounter } from "react-use";
import { useTimeframe } from "./useTimeframe";

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
    </VStack>
  );
};

export const DateTimeRangePicker: FC = () => {
  const { onScaleChange } = useTimeframe();
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
        setStartDate(addMinutes(now, -59));
        setEndDate(now);
        break;
      case "lastd":
        setStartDate(addHours(now, -23));
        setEndDate(now);
        break;
      case "lastw":
        setStartDate(addDays(now, -6));
        setEndDate(now);
        break;
      case "custom":
        break;
    }

    setPickMode(mode);
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
  const onApply = () => {
    if (startDate && endDate) onScaleChange(startDate, endDate);
  }

  return (
    <HStack p={2} align={"start"}>
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
      <VStack w="full" align={"end"}>
        <RangeCalendar
          startDate={startDate}
          endDate={endDate}
          onChange={onChangeDate}
          isDisabled={pickMode !== "custom"}
        />
        <Button colorScheme="cyan" isDisabled={!startDate || !endDate} onClick={onApply}>Apply</Button>
      </VStack>
    </HStack>
  );
};
