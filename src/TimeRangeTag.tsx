import { Button, ButtonGroup, HStack, IconButton, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, SliderThumb, Spacer, Tag, TagLabel, Tooltip, useDisclosure } from "@chakra-ui/react";
import { format, formatDistanceStrict, intervalToDuration } from "date-fns";
import { FC } from "react";
import { ja } from 'date-fns/locale';
import { isTimeframeAvailable, TimeUnit, TimeUnits, useTimeframe } from "./useTimeframe";
import { TbChevronLeftPipe, TbChevronRightPipe, TbMinus, TbPlus, TbZoomIn, TbZoomInArea, TbZoomOut } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";

interface Props {
  isZoom: boolean;
  onToggleZoom: () => void;
}

export const TimeRangeTag: FC<Props> = ({ isZoom, onToggleZoom }) => {
  const { timeframe, onChangeTimeframe, zoomIn, zoomOut, prev, next, zoom, slotNum } = useTimeframe();
  const duration = intervalToDuration({ start: timeframe.start, end: timeframe.end });
  const label = Object.keys(duration).flatMap((k) => {
    return [duration[k as keyof Duration]?.toString(), k];
  });

  return <HStack w="full">
    <Tag colorScheme={'orange'} >
      <TagLabel>
        {format(timeframe.start, "PP p", { locale: ja })
          + ' - ' + format(timeframe.end, "PP p", { locale: ja })
        }
      </TagLabel>
    </Tag>
    <Menu>
      <Tag colorScheme={'orange'} as={MenuButton}>
        <TagLabel>
          {label}
        </TagLabel>
      </Tag>
      <MenuList>
        <MenuItem onClick={() => zoom('hour')}>Hour</MenuItem>
        <MenuItem onClick={() => zoom('day')}>Day</MenuItem>
        <MenuItem onClick={() => zoom('week')}>Week</MenuItem>
        <MenuItem onClick={() => zoom('month')}>Month</MenuItem>
      </MenuList>
    </Menu>
    <ButtonGroup colorScheme="cyan" isAttached size={"sm"}>

      <IconButton aria-label={"zoom-out"} icon={<TbMinus />} onClick={zoomOut} />
      <Button>{slotNum + ' ' + timeframe.unit}</Button>
      <IconButton aria-label={"zoom-out"} icon={<TbPlus />} onClick={zoomOut} />
    </ButtonGroup>
    <ButtonGroup colorScheme="cyan" isAttached size={"sm"}>
      <Menu>
        <MenuButton as={Button}>
          {timeframe.unit}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup value={timeframe.unit} type="radio" onChange={(e) => onChangeTimeframe({ ...timeframe, unit: e as TimeUnit })}>
            {TimeUnits.map(v =>
              <MenuItemOption key={v} value={v} isDisabled={!isTimeframeAvailable({ ...timeframe, unit: v })}>
                {v}
              </MenuItemOption>)}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </ButtonGroup>
    <ButtonGroup colorScheme="orange" isAttached size={"sm"}>
      <IconButton aria-label={"prev"} icon={<TbChevronLeftPipe />} onClick={prev} />
      <IconButton aria-label={"next"} icon={<TbChevronRightPipe />} onClick={next} />
      <IconButton aria-label={"area-zoom"} onClick={onToggleZoom} isActive={isZoom} icon={<TbZoomInArea />} />
      <IconButton aria-label={"zoom-in"} icon={<TbZoomIn />} onClick={zoomIn} />
      <IconButton aria-label={"zoom-out"} icon={<TbZoomOut />} onClick={zoomOut} />
    </ButtonGroup>
  </HStack>
}