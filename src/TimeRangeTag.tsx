import { HStack, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel, TagLeftIcon, TagRightIcon } from "@chakra-ui/react";
import { format, intervalToDuration } from "date-fns";
import { FC } from "react";
import { ja } from 'date-fns/locale';
import { useTimeframe } from "./useTimeframe";
import { TbArrowLeft, TbArrowRight, TbMinus, TbPlus } from "react-icons/tb";


export const TimeRangeTag: FC = () => {
  const { timeframe, zoomIn, zoomOut, prev, next, zoom } = useTimeframe();
  const duration = intervalToDuration({ start: timeframe.start, end: timeframe.end });
  const label = Object.keys(duration).flatMap((k) => {
    return [duration[k as keyof Duration]?.toString(), k];
  });

  return <HStack w="full">
    <Tag colorScheme={'orange'} >
      <TagLeftIcon as={TbArrowLeft} onClick={prev} />
      <TagLabel>
        {format(timeframe.start, "PP p", { locale: ja })
          + ' - ' + format(timeframe.end, "PP p", { locale: ja })
        }
      </TagLabel>
      <TagRightIcon as={TbArrowRight} onClick={next} />
    </Tag>
    <Tag colorScheme={'orange'} >
      <TagLeftIcon as={TbMinus} onClick={zoomIn} />
      <Menu>
        <TagLabel as={MenuButton}>
          {label}
        </TagLabel>
        <MenuList>
          <MenuItem onClick={() => zoom('minute')}>Minute</MenuItem>
          <MenuItem onClick={() => zoom('hour')}>Hour</MenuItem>
          <MenuItem onClick={() => zoom('day')}>Day</MenuItem>
          <MenuItem onClick={() => zoom('week')}>Week</MenuItem>
        </MenuList>
      </Menu>
      <TagRightIcon as={TbPlus} onClick={zoomOut} />
    </Tag>
  </HStack>
}