import { Button, Tag } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { add, min, sub } from "date-fns";
import { FC, useMemo, useState } from "react";

export const DatePicker: FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);

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
    <RangeDatepicker
      selectedDates={selectedDates}
      onDateChange={setSelectedDates}
      propsConfigs={calenderStyleProps}
      configs={{ monthsToDisplay: 1 }}
      closeOnSelect={false}
    />
  );
};
