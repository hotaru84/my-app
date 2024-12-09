import { Point } from "chart.js";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, endOfDay, endOfHour, endOfMinute, startOfDay, startOfHour, startOfMinute } from "date-fns";
import { Timeframe } from "./SampleData";


export function makeTimescale(start: number, end: number): Timeframe {
  const s = differenceInSeconds(end, start);
  const m = differenceInMinutes(end, start);
  const h = differenceInHours(end, start);
  const d = differenceInDays(end, start);
  if (m <= 60) {
    return {
      start: new Date(start),
      end: new Date(end),
      slot: s
    }
  }
  if (m < 60) {
    return {
      start: startOfMinute(start),
      end: endOfMinute(end),
      slot: m
    }
  }
  if (h < 24) {
    return {
      start: startOfHour(start),
      end: endOfHour(end),
      slot: h
    }
  }

  return {
    start: startOfDay(start),
    end: endOfDay(end),
    slot: d
  }
}

export const useTimeline = (
  times: Date[],
  timeframe: Timeframe
): Point[] => {
  const diffSec = Math.max(
    Math.floor(
      differenceInSeconds(timeframe.end, timeframe.start) / timeframe.slot
    ), 1);

  const point = [...Array(timeframe.slot)].map((_, i) => ({ x: i * diffSec, y: 0 }));

  const getSlotIndex = (time: Date) => {
    return Math.max(Math.floor(differenceInSeconds(time, timeframe.start) / diffSec), 0);
  }
  times.forEach(t => {
    point[getSlotIndex(t)].y += 1;
  });

  return point;
}