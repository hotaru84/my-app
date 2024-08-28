import { Tag, TagCloseButton, TagLeftIcon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { format, isSameDay } from "date-fns";
import { FC } from "react";
import { TbRefresh } from "react-icons/tb";

interface TimeRangeTagProps {
    min: Date | undefined;
    max: Date | undefined;
}

export const TimeRangeTag: FC<TimeRangeTagProps> = (
    {
        min, max,
    }) => {
    if (min === undefined || max === undefined) return <></>;

    return <Tag colorScheme={time ? 'white' : 'orange'} w="fit-content">
        {isActive && <TagLeftIcon as={TbRefresh} onClick={onOpen} />}
        {
            isSameDay(max, min) ?
                format(min, "yyyy/MM/dd ") + format(min, "hh:mm:ss") + ' - ' + format(max, "hh:mm:ss")
                : format(min, "yyyy/MM/dd hh:mm") + '-' + format(max, "yyyy/MM/dd hh:mm")
        }
        {<TagCloseButton />}
    </Tag>;
}