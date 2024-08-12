import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { OnDateSelected, RangeCalendarPanel } from "chakra-dayzed-datepicker";
import {
  Button,
  HStack,
  Input,
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
} from "@chakra-ui/react";
import { compareAsc, endOfDay, format, parse, startOfDay } from "date-fns";
import "rc-time-picker/assets/index.css";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import { TbCalendarSearch } from "react-icons/tb";

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
    <Collapse in={date !== undefined}>
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
    </Collapse>
  );
};

interface SelectOption extends OptionBase {
  label: string;
  value: string;
}

interface RangeSelectorProps {
  select?: SelectOption;
  onSelect: (v: SelectOption) => void;
}

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
    label: "Date range",
    value: "range",
  },
];

const DateTimeRangeSelector: FC<RangeSelectorProps> = ({
  select,
  onSelect,
}) => {
  return (
    <Select<SelectOption, false, GroupBase<SelectOption>>
      colorScheme="cyan"
      variant="filled"
      defaultValue={select}
      options={options}
      onChange={(v) => (v ? onSelect(v) : null)}
    />
  );
};

export const DateTimeRangePicker: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [option, setOption] = useState<SelectOption>(options[0]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const onChangeDate = (start?: Date, end?: Date) => {
    setStartDate(start);
    if ((start && end && compareAsc(end, start) > 0) || !end) setEndDate(end);
  };

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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>
            <DateTimeRangeSelector select={option} onSelect={setOption} />
          </ModalHeader>
          <ModalBody>
            <Collapse in={option.value === "range"}>
              <VStack w="full">
                <RangeCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onChange={onChangeDate}
                />
                <HStack gap={2} w="full" justify={"center"}>
                  <TimePicker
                    label="From:"
                    date={startDate}
                    setDate={setStartDate}
                  />
                  <Divider w="10px" />
                  <TimePicker label="To:" date={endDate} setDate={setEndDate} />
                </HStack>
              </VStack>
            </Collapse>
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
