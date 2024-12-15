import { addDays, addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes, startOfDay, startOfHour, startOfMinute, startOfMonth } from "date-fns";
import { endOfMonth, startOfToday } from "date-fns";
import { Point } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type TimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export const TimeUnits: TimeUnit[] = [
  "millisecond",
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "quarter",
  "year"
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
  zoomIn: () => void;
  zoomOut: () => void;
  prev: () => void;
  next: () => void;
}

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

  const action = useMemo(() => {
    switch (timeframe.unit) {
      case 'hour':
        return {
          getIndex: differenceInHours,
          getDate: startOfHour,
          add: addHours,
        }
      case 'day':
        return {
          getIndex: differenceInDays,
          getDate: startOfDay,
          add: addDays,
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
  }, [timeframe.unit]);

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
    zoomIn,
    zoomOut,
    prev,
    next,
  };
};
