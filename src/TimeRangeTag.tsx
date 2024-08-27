import { Tag } from "@chakra-ui/react";
import { format, isSameDay } from "date-fns";
import { FC } from "react";

interface TimeRangeTagProps {
    min: Date | undefined;
    max: Date | undefined;
    isActive?: boolean;
}

export const TimeRangeTag: FC<TimeRangeTagProps> = ({ min, max, isActive = false }) => {
    if (min === undefined || max === undefined) return <></>;

    return <Tag colorScheme={isActive ? 'white' : 'orange'} w="fit-content">
        {
            isSameDay(max, min) ?
                format(min, "yyyy/MM/dd ") + format(min, "hh:mm:ss") + ' - ' + format(max, "hh:mm:ss")
                : format(min, "yyyy/MM/dd hh:mm") + '-' + format(max, "yyyy/MM/dd hh:mm")
        }
    </Tag>;

}