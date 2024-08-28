import { Point } from "chart.js";
import { addSeconds, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, endOfDay, endOfHour, endOfMinute, startOfDay, startOfHour, startOfMinute } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { start } from "repl";

type Timescale = {
  start: Date;
  end: Date;
  slot: number;
}

export type TimelineStats = {
  ratePoints: Point[];
  errorPoints: Point[];
  totalPoints: Point[];
  scale: Timescale;
  isZoomed: boolean;
  scaleDiffSec: number;
  setScale: (scale: Timescale) => void;
  resetScale: () => void;
}

export function makeTimescale(start: number, end: number): Timescale {
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

export function useTimelineStats(base: Timescale): TimelineStats {
  const [scale, setScale] = useState<Timescale>(base);
  const [errorPoints, setErrorPoints] = useState<Point[]>([]);
  const [totalPoints, setTotalPoints] = useState<Point[]>([]);

  const resetScale = useCallback(() => {
    setScale(base);
  }, [base]);

  const scaleDiffSec = useMemo(() => Math.max(
    Math.floor(
      differenceInSeconds(scale.end, scale.start) / base.slot
    ), 1),
    [base.slot, scale.end, scale.start]);

  const isZoomed = useMemo(() =>
    base.start.getSeconds() !== scale.start.getSeconds() ||
    base.end.getSeconds() !== scale.end.getSeconds(),
    [base.end, base.start, scale.end, scale.start]);

  useEffect(() => {
    setTotalPoints([...Array(scale.slot)].map((_, i) => ({
      x: addSeconds(scale.start, scaleDiffSec * i).getTime(),
      y: Math.floor(Math.random() * 250)
    })));

    setErrorPoints([...Array(scale.slot)].map((_, i) => ({
      x: addSeconds(scale.start, scaleDiffSec * i).getTime(),
      y: Math.floor(Math.random() * 30)
    })));

  }, [scale.slot, scale.start, scaleDiffSec]);

  const ratePoints = useMemo(() => totalPoints.map((p, i) => ({
    x: p.x,
    y: Math.floor((p.y - errorPoints[i].y) / p.y * 10000) / 100,
  })), [errorPoints, totalPoints]);

  return {
    totalPoints,
    errorPoints,
    ratePoints,
    scale,
    scaleDiffSec,
    isZoomed,
    setScale,
    resetScale,
  }
}