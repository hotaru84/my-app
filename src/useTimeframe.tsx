import { addDays, addHours, addMinutes, addMonths, addSeconds, addWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInWeeks, startOfDay, startOfHour, startOfMinute, startOfMonth, startOfSecond, startOfWeek } from "date-fns";
import { endOfMonth, startOfToday } from "date-fns";
import { Point } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const maxSlotSize = 7 * 24;

export type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"

export const TimeUnits: TimeUnit[] = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
];

export type Timeframe = {
  start: Date;
  end: Date;
  unit: TimeUnit;
}

interface IdsSearchParamAction {
  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;
  timeToPoint: (t: Date[]) => Point[];
  zoom: (unit: TimeUnit) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  prev: () => void;
  next: () => void;
}

const getTimeUnitAction = (unit: TimeUnit) => {
  switch (unit) {
    case 'month':
      return {
        getIndex: differenceInMonths,
        getDate: startOfMonth,
        add: addMonths,
      }
    case 'week':
      return {
        getIndex: differenceInWeeks,
        getDate: startOfWeek,
        add: addWeeks,
      }
    case 'day':
      return {
        getIndex: differenceInDays,
        getDate: startOfDay,
        add: addDays,
      }
    case 'hour':
      return {
        getIndex: differenceInHours,
        getDate: startOfHour,
        add: addHours,
      }
    case 'second':
      return {
        getIndex: differenceInSeconds,
        getDate: startOfSecond,
        add: addSeconds,
      }
    case 'minute':
      return {
        getIndex: differenceInMinutes,
        getDate: startOfMinute,
        add: addMinutes,
      }
    default:
      return {
        getIndex: differenceInDays,
        getDate: startOfDay,
        add: addDays
      }
  }
};
export const isTimeframeAvailable = (tf: Timeframe) => {
  return getTimeUnitAction(tf.unit).getIndex(tf.end, tf.start) < maxSlotSize;
};

export const useTimeframe = (): IdsSearchParamAction => {
  const [param, setParam] = useSearchParams();

  const timeframe = useMemo((): Timeframe => {
    const today = startOfToday();
    const tfs = Number(param.get("start") ?? startOfMonth(today));
    const tfe = Number(param.get("end") ?? endOfMonth(today));
    const unit = param.get("unit");

    return {
      start: new Date(tfs),
      end: new Date(tfe),
      unit: TimeUnits.find(u => u === unit) ?? 'day',
    };
  }, [param]);

  const action = useMemo(() => getTimeUnitAction(timeframe.unit), [timeframe.unit])

  const timeToPoint = useCallback((t: Date[]) => {
    const point: Point[] = [];
    t.forEach(t => {
      const idx = action.getIndex(t, action.getDate(timeframe.start));
      if (idx >= 0 && point.length > idx) {
        point[idx].y += 1;
      } else {
        point.push({
          x: action.getDate(t).getTime(),
          y: 1
        });
      }
    });
    return point;
  }, [action, timeframe.start]);

  const onChangeTimeframe = useCallback((tf: Timeframe) => {
    if (tf.start >= tf.end) return;
    if (!isTimeframeAvailable(tf)) return; // to avoid too much slots

    param.set("start", String(tf.start.getTime()));
    param.set("end", String(tf.end.getTime()));
    param.set("unit", tf.unit);
    setParam(param);
  }, [param, setParam]);

  const zoomOut = useCallback(() => {
    onChangeTimeframe({
      ...timeframe,
      start: action.add(timeframe.start, -0.5),
      end: action.add(timeframe.end, 0.5)
    })
  }, [action, onChangeTimeframe, timeframe]);

  const zoomIn = useCallback(() => {
    onChangeTimeframe({
      ...timeframe,
      start: action.add(timeframe.start, 0.5),
      end: action.add(timeframe.end, -0.5)
    })
  }, [action, onChangeTimeframe, timeframe]);

  const zoom = useCallback((unit: TimeUnit) => {
    const action = getTimeUnitAction(unit);
    const start = action.getDate(timeframe.start);
    const end = action.add(start, 1);
    const nextUnit = TimeUnits.find((u) => isTimeframeAvailable({ unit: u, end, start })) ?? 'day';
    console.log(start, end, nextUnit)

    onChangeTimeframe({
      start,
      end,
      unit: nextUnit
    })
  }, [onChangeTimeframe, timeframe]);


  const prev = useCallback(() => {
    onChangeTimeframe({
      ...timeframe,
      start: action.add(timeframe.start, -1),
      end: action.add(timeframe.end, -1)
    })
  }, [action, onChangeTimeframe, timeframe]);

  const next = useCallback(() => {
    onChangeTimeframe({
      ...timeframe,
      start: action.add(timeframe.start, 1),
      end: action.add(timeframe.end, 1)
    })
  }, [action, onChangeTimeframe, timeframe]);

  return {
    timeframe,
    onChangeTimeframe,
    timeToPoint,
    zoom,
    zoomIn,
    zoomOut,
    prev,
    next,
  };
};
