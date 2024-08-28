import { Tag, TagCloseButton, Tooltip } from "@chakra-ui/react";
import { format, isSameDay } from "date-fns";
import { FC } from "react";

interface TimeRangeTagProps {
    min: Date | undefined;
    max: Date | undefined;
    isActive?: boolean;
    onClick?: () => void;
}

export const TimeRangeTag: FC<TimeRangeTagProps> = (
    { min, max, isActive = false, onClick

    }) => {
    if (min === undefined || max === undefined) return <></>;

    return <Tooltip label={onClick && !isActive && 'Reset timescale'} closeOnClick>
        <Tag colorScheme={isActive ? 'white' : 'orange'} w="fit-content">
            {
                isSameDay(max, min) ?
                    format(min, "yyyy/MM/dd ") + format(min, "hh:mm:ss") + ' - ' + format(max, "hh:mm:ss")
                    : format(min, "yyyy/MM/dd hh:mm") + '-' + format(max, "yyyy/MM/dd hh:mm")
            }
            {onClick !== undefined && !isActive && <TagCloseButton onClick={onClick} />}
        </Tag>
    </Tooltip>;
}