import { Tag, TagCloseButton, TagLeftIcon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { FC } from "react";
import { TbCalendarSearch, TbRefresh } from "react-icons/tb";

interface TimeRangeTagProps {
  min: Date | undefined;
  max: Date | undefined;
  isZoom: boolean;
  onClick: () => void;
}

export const TimeRangeTag: FC<TimeRangeTagProps> = (
  {
    min, max, isZoom, onClick
  }) => {
  if (min === undefined || max === undefined) return <></>;

  return <Tag colorScheme={isZoom ? 'orange' : 'gray'} w="fit-content" onClick={onClick} cursor={'pointer'} as={motion.div} whileHover={{ filter: 'brightness(0.9)' }}>
    {!isZoom && <TagLeftIcon as={TbCalendarSearch} />}
    {isSameDay(max, min) ?
      format(min, "yyyy/MM/dd ") + format(min, "hh:mm:ss") + ' - ' + format(max, "hh:mm:ss")
      : format(min, "yyyy/MM/dd hh:mm") + '-' + format(max, "yyyy/MM/dd hh:mm")
    }
    {isZoom && <TagCloseButton />}
  </Tag>;
}