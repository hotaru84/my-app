import { Button, ButtonGroup, HStack, IconButton, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Spacer, Tag, TagLabel } from "@chakra-ui/react";
import { format, formatDistanceStrict } from "date-fns";
import { FC } from "react";
import { ja } from 'date-fns/locale';
import { isTimeframeAvailable, TimeUnit, TimeUnits, useTimeframe } from "./useTimeframe";
import { TbChevronLeftPipe, TbChevronRightPipe, TbZoomIn, TbZoomInArea, TbZoomOut } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";

interface Props {
  isZoom: boolean;
  onToggleZoom: () => void;
}

export const TimeRangeTag: FC<Props> = ({ isZoom, onToggleZoom }) => {
  const { timeframe, onChangeTimeframe, zoomIn, zoomOut, prev, next, zoom } = useTimeframe();

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
          {formatDistanceStrict(timeframe.start, timeframe.end, { locale: ja })}
        </TagLabel>
      </Tag>
      <MenuList>
        <MenuItem onClick={() => zoom('hour')}>Hour</MenuItem>
        <MenuItem onClick={() => zoom('day')}>Day</MenuItem>
        <MenuItem onClick={() => zoom('week')}>Week</MenuItem>
        <MenuItem onClick={() => zoom('month')}>Month</MenuItem>
      </MenuList>
    </Menu>
    <ButtonGroup variant='ghost' colorScheme="orange" isAttached size={"sm"}>
      <Menu>
        <MenuButton as={Button} leftIcon={<MdAccessTime />}>
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
      <IconButton aria-label={"prev"} icon={<TbChevronLeftPipe />} onClick={prev} />
      <IconButton aria-label={"next"} icon={<TbChevronRightPipe />} onClick={next} />
      <IconButton aria-label={"area-zoom"} onClick={onToggleZoom} isActive={isZoom} icon={<TbZoomInArea />} />
      <IconButton aria-label={"zoom-in"} icon={<TbZoomIn />} onClick={zoomIn} />
      <IconButton aria-label={"zoom-out"} icon={<TbZoomOut />} onClick={zoomOut} />
    </ButtonGroup>
  </HStack>
}