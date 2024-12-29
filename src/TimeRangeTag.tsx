import { HStack, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel, TagLeftIcon, TagRightIcon } from "@chakra-ui/react";
import { format, formatDistanceStrict } from "date-fns";
import { FC } from "react";
import { ja } from 'date-fns/locale';
import { useTimeframe } from "./useTimeframe";
import { TbArrowLeft, TbArrowRight, TbMinus, TbPlus } from "react-icons/tb";
import { DateTimeRangePicker } from "./DateTimeRangePicker";


export const TimeRangeTag: FC = () => {
  const { timeframe, zoomIn, zoomOut, prev, next, zoom } = useTimeframe();
  const label = formatDistanceStrict(timeframe.start, timeframe.end);

  return <HStack w="full">
    <Tag colorScheme={'cyan'}>
      <TagLeftIcon as={TbArrowLeft} onClick={prev} cursor={'pointer'} />
      <Menu>
        <TagLabel as={MenuButton} fontWeight='bold'>
          {format(timeframe.start, "PP p", { locale: ja })
            + ' - ' + format(timeframe.end, "PP p", { locale: ja })
          }
        </TagLabel>
        <MenuList>
          <DateTimeRangePicker />
        </MenuList>
      </Menu>
      <TagRightIcon as={TbArrowRight} onClick={next} cursor={'pointer'} />
    </Tag>
    <Tag colorScheme={'cyan'} >
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