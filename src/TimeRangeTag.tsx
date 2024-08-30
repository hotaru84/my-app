import { Tag, TagCloseButton, TagLeftIcon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Duration, format, formatDistanceStrict, formatDuration, intervalToDuration, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { FC } from "react";
import { TbCalendarSearch, TbRefresh } from "react-icons/tb";
import { ja, enUS, de } from 'date-fns/locale';

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
    {
      format(min, "PP p", { locale: ja }) + ',  ' + formatDistanceStrict(min, max, { locale: ja })
    }
    {isZoom && <TagCloseButton />}
  </Tag>;
}