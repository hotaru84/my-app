import { FC, useState } from "react";
import {
  OnDateSelected,
  RangeCalendarPanel,
  RangeDatepicker,
} from "chakra-dayzed-datepicker";
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import { addDays } from "date-fns";

const Month_Names_Full = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

const RangeCalendarDemo = () => {
  const demoDate = new Date();
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    demoDate,
    demoDate,
  ]);

  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    let newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        let firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        setSelectedDates(newDates);
        return;
      }

      if (newDates.length === 2) {
        setSelectedDates([date]);
        return;
      }
    } else {
      newDates.push(date);
      setSelectedDates(newDates);
    }
  };

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

  return (
    <Box>
      <RangeCalendarPanel
        selected={selectedDates}
        dayzedHookProps={{
          showOutsideDays: false,
          onDateSelected: handleOnDateSelected,
          selected: selectedDates,
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
    </Box>
  );
};

export const DatePickerPopover: FC = () => {
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
            <RangeCalendarDemo />
          </PopoverBody>
          <PopoverFooter>
            <Button onClick={onClose}>Apply</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
