import { Button, ButtonGroup, HStack, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Spacer, Tag, TagLabel } from "@chakra-ui/react";
import { format, formatDistanceStrict } from "date-fns";
import { FC } from "react";
import { ja } from 'date-fns/locale';
import { TimeUnit, TimeUnits, useTimeframe } from "./useTimeframe";
import { TbArrowLeft, TbArrowRight, TbZoomIn, TbZoomOut } from "react-icons/tb";
import { MdAccessTime } from "react-icons/md";


export const TimeRangeTag: FC = () => {
  const { timeframe, onChangeTimeframe, zoomIn, zoomOut, prev, next } = useTimeframe();

  return <HStack w="full">
    <ButtonGroup variant='ghost' colorScheme="cyan" isAttached>
      <Menu>
        <MenuButton as={Button} leftIcon={<MdAccessTime />}>
          {timeframe.unit}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup value={timeframe.unit} type="radio" onChange={(e) => onChangeTimeframe({ ...timeframe, unit: e as TimeUnit })}>
            {TimeUnits.map(v =>
              <MenuItemOption key={v} value={v}>
                {v}
              </MenuItemOption>)}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      <IconButton aria-label={"prev"} icon={<TbArrowLeft />} onClick={prev} />
      <IconButton aria-label={"next"} icon={<TbArrowRight />} onClick={next} />
    </ButtonGroup>

    <ButtonGroup variant='ghost' colorScheme="cyan" isAttached>
      <IconButton aria-label={"zoom-in"} icon={<TbZoomIn />} onClick={zoomIn} />
      <IconButton aria-label={"zoom-out"} icon={<TbZoomOut />} onClick={zoomOut} />
    </ButtonGroup>
    <Spacer />
    <Tag colorScheme={'orange'} >
      <TagLabel>
        {format(timeframe.start, "PP p", { locale: ja })
          + ' - ' + format(timeframe.end, "PP p", { locale: ja })
        }
      </TagLabel>
    </Tag>
    <Tag colorScheme={'orange'} >
      <TagLabel>
        {formatDistanceStrict(timeframe.start, timeframe.end, { locale: ja })
        }
      </TagLabel>
    </Tag>
  </HStack>
}