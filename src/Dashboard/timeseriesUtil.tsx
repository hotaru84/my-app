import { Point } from "chart.js";
import { addDays, addHours, addMinutes, addSeconds, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, startOfDay, startOfHour, startOfMinute, startOfSecond } from "date-fns";
import { Timeframe } from "./SampleData";


type TimeseriesCfg = {
  binSize: number;
  getDate: (index: number) => Date;
  getIndex: (date: Date) => number;
};

export function generateTimeseriesCfg(tf: Timeframe): TimeseriesCfg {
  const start = Math.min(tf.start.getTime(), tf.end.getTime());
  const end = Math.max(tf.start.getTime(), tf.end.getTime());
  const s = differenceInSeconds(end, start);
  const m = differenceInMinutes(end, start);
  const h = differenceInHours(end, start);
  const d = differenceInDays(end, start);
  console.log(tf)

  if (d >= 5) return {
    binSize: d,
    getDate: (i: number) => addDays(startOfDay(start), i),
    getIndex: (d: Date) => differenceInDays(d, start)
  };
  if (m >= 120) return {
    binSize: h,
    getDate: (i: number) => addHours(startOfHour(start), i),
    getIndex: (d: Date) => differenceInHours(d, start)
  };

  return {
    binSize: m,
    getDate: (i: number) => addMinutes(startOfMinute(start), i + 1),
    getIndex: (d: Date) => differenceInMinutes(d, start)
  };

}

export const generateTimeseries = (
  times: Date[],
  cfg: TimeseriesCfg
): Point[] => {

  const point = [...Array(cfg.binSize)].map((_, i) => ({
    x: cfg.getDate(i).getTime(),
    y: 0
  }));

  times.forEach(t => {
    const idx = cfg.getIndex(t);
    if (idx >= 0 && point.length > idx) point[idx].y += 1;
  });

  return point;
}