import { addDays, addHours, addMinutes, addSeconds, addWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, differenceInWeeks, endOfDay, endOfHour, endOfMinute, endOfSecond, startOfDay, startOfHour, startOfMinute, startOfMonth, startOfSecond, startOfWeek } from "date-fns";
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
  timescale: { min: number, max: number },
  onChangeTimeframe: (start: Date, end: Date) => void;
  onScaleChange: (start: Date, end: Date) => void;
  timeToPoint: (t: Date[]) => Point[];
  zoom: (unit: TimeUnit) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  prev: () => void;
  next: () => void;
}
interface TimeUnitAction {
  getIndex: (dateLeft: Date | number, dateRight: Date | number) => number;
  start: (date: Date | number) => Date;
  end: (date: Date | number) => Date;
  add: (date: Date | number, amount: number) => Date;
  isVaildNumOfSlot: (slot: number) => boolean;
}

const getTimeUnitAction = (unit: TimeUnit): TimeUnitAction => {
  switch (unit) {
    case 'week':
      return {
        getIndex: differenceInWeeks,
        start: startOfWeek,
        end: endOfMonth,
        add: addWeeks,
        isVaildNumOfSlot: (slot: number): boolean => slot > 4 && slot <= 4 * 3,
      }
    case 'day':
      return {
        getIndex: differenceInDays,
        start: startOfDay,
        end: endOfDay,
        add: addDays,
        isVaildNumOfSlot: (slot: number): boolean => slot > 1 && slot <= 30,
      }
    case 'hour':
      return {
        getIndex: differenceInHours,
        start: startOfHour,
        end: endOfHour,
        add: addHours,
        isVaildNumOfSlot: (slot: number): boolean => slot > 1 && slot <= 24,
      }
    case 'minute':
      return {
        getIndex: differenceInMinutes,
        start: startOfMinute,
        end: endOfMinute,
        add: addMinutes,
        isVaildNumOfSlot: (slot: number): boolean => slot >= 1 && slot <= 60,
      }
    case 'second':
      return {
        getIndex: differenceInSeconds,
        start: startOfSecond,
        end: endOfSecond,
        add: addSeconds,
        isVaildNumOfSlot: (slot: number): boolean => slot > 0 && slot <= 60,
      }
    default:
      return {
        getIndex: differenceInDays,
        start: startOfDay,
        end: endOfDay,
        add: addDays,
        isVaildNumOfSlot: (slot: number): boolean => slot > 2 && slot <= 30,
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

  const timescale = useMemo(() => {
    // timescale for timeline-graph, offset end slot because of no data
    return {
      min: timeframe.start.getTime(),
      max: getTimeUnitAction(timeframe.unit).add(timeframe.end, -1).getTime(),
    }
  }, [timeframe.end, timeframe.start, timeframe.unit]);

  const timeToPoint = useCallback((t: Date[]) => {
    const action = getTimeUnitAction(timeframe.unit);
    const point: Point[] = [...Array(action.getIndex(timeframe.end, timeframe.start))].map((_, i) => ({
      x: action.add(timeframe.start, i).getTime(),
      y: 0
    }));

    t.sort().forEach(t => {
      const idx = action.getIndex(action.start(t), timeframe.start);
      if (idx >= 0 && point.length > idx) {
        point[idx].y += 1;
      }
    });
    return point;
  }, [timeframe]);

  const onChangeTimeframe = useCallback((s: Date, e: Date) => {
    if (s.getTime() > e.getTime()) return;

    // calc appropriate timeunit
    const unit = TimeUnits.find(u => {
      const act = getTimeUnitAction(u);

      return act.isVaildNumOfSlot(act.getIndex(e, s));
    });
    if (unit === undefined) return;

    const act = getTimeUnitAction(unit);
    // based on start of date
    param.set("start", String(act.start(s).getTime()));
    param.set("end", String(act.start(e).getTime()));
    param.set("unit", unit);
    setParam(param);
  }, [param, setParam]);

  const onScaleChange = useCallback((s: Date, e: Date) => {
    //scale is based on start of date then shift to end
    const end = getTimeUnitAction(timeframe.unit).add(e, 1);
    onChangeTimeframe(s, end);
  }, [onChangeTimeframe, timeframe.unit]);


  const zoomOut = useCallback(() => {
    const action = getTimeUnitAction(timeframe.unit);
    onChangeTimeframe(action.add(timeframe.start, -1), timeframe.end)
  }, [onChangeTimeframe, timeframe]);

  const zoomIn = useCallback(() => {
    const action = getTimeUnitAction(timeframe.unit);
    onChangeTimeframe(action.add(timeframe.start, 1), timeframe.end);
  }, [onChangeTimeframe, timeframe]);

  const zoom = useCallback((scale: TimeUnit) => {
    const action = getTimeUnitAction(scale);
    onChangeTimeframe(action.add(timeframe.end, -1), timeframe.end);
  }, [onChangeTimeframe, timeframe]);

  const prev = useCallback(() => {
    const action = getTimeUnitAction(timeframe.unit);
    onChangeTimeframe(
      action.add(timeframe.start, -1),
      action.add(timeframe.end, -1)
    );
  }, [onChangeTimeframe, timeframe]);

  const next = useCallback(() => {
    const action = getTimeUnitAction(timeframe.unit);
    onChangeTimeframe(
      action.add(timeframe.start, 1),
      action.add(timeframe.end, 1)
    );
  }, [onChangeTimeframe, timeframe]);

  return {
    timeframe,
    timescale,
    onChangeTimeframe,
    onScaleChange,
    timeToPoint,
    zoom,
    zoomIn,
    zoomOut,
    prev,
    next,
  };
};
