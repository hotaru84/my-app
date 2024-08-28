import { Point } from "chart.js";
import { addHours, addSeconds, differenceInMinutes, differenceInSeconds, secondsToHours } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useInterval } from "react-use";

type Timescale = {
  start: Date;
  end: Date;
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
  refresh: () => void;
}


export function useTimelineStats(min: Date, max: Date, numOfSlot: number = 60): TimelineStats {
  const [scale, setScale] = useState<Timescale>({ start: min, end: max });
  const [errorPoints, setErrorPoints] = useState<Point[]>([]);
  const [totalPoints, setTotalPoints] = useState<Point[]>([]);

  const resetScale = useCallback(() => {
    setScale({ start: min, end: max });
  }, [max, min]);

  const scaleDiffSec = useMemo(() => Math.max(
    Math.floor(
      differenceInSeconds(scale.start, scale.end) / numOfSlot
    ), 1),
    [numOfSlot, scale.end, scale.start]);


  const refresh = useCallback(() => {
    const now = new Date();
    setTotalPoints([...Array(numOfSlot)].map((_, i) => ({
      x: addSeconds(now, scaleDiffSec * i).getTime(),
      y: Math.floor(Math.random() * 250)
    })));

    setErrorPoints([...Array(numOfSlot)].map((_, i) => ({
      x: addSeconds(now, scaleDiffSec * i).getTime(),
      y: Math.floor(Math.random() * 30)
    })));

  }, [numOfSlot, scaleDiffSec]);

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
    isZoomed: min.getSeconds() ===
      setScale,
    resetScale,
    refresh,
  }
}