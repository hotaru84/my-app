import { useMemo } from "react";

type Slot = {
  min: number;
  max: number;
};

export type Histgram = {
  bins: number[];
  row: Slot;
};

export type Histgram2d = {
  bins: number[][];
  row: Slot;
  col: Slot;
};

export const useHistgram = <T, R extends keyof T>(
  data: T[],
  rowKey: R,
  numOfSlot: number
): Histgram => {

  const h = useMemo(() => {
    const row = data.reduce<Slot>((r, d) => (
      {
        max: Math.ceil(Math.max(r.max, Number(d[rowKey]))),
        min: Math.floor(Math.min(r.min, Number(d[rowKey]))),
        step: numOfSlot
      }
    ), { max: 0, min: Infinity });

    const step = Math.floor((row.max - row.min) / numOfSlot);
    const bins = [...Array<number>(numOfSlot)].fill(0);

    data.forEach((d) => {
      const r = Math.floor((Number(d[rowKey]) - row.min) / step);
      if (r < numOfSlot) bins[r]++;
    });

    return {
      bins,
      row,
    };
  }, [data, rowKey, numOfSlot]);

  return h;
}

export const useHistgram2d = <T, R extends keyof T, C extends keyof T>(
  data: T[],
  rowKey: R,
  numOfRows: number,
  colKey: C,
  numOfColumns: number
): Histgram2d => {

  const h = useMemo(() => {
    const [row, col] = data.reduce<[Slot, Slot]>(([r, c], d) => (
      [{
        max: Math.max(r.max, Number(d[rowKey])),
        min: Math.min(r.min, Number(d[rowKey])),
      }, {
        max: Math.max(c.max, Number(d[colKey])),
        min: Math.min(c.min, Number(d[colKey])),
      }]
    ), [{ max: 0, min: Infinity }, { max: 0, min: Infinity }]);

    const bins = [...Array<number>(numOfRows + 1)].map(_ => [...Array<number>(numOfColumns + 1)].fill(0));
    const rowStep = Math.ceil((row.max - row.min) / numOfRows);
    const colStep = Math.ceil((col.max - col.min) / numOfColumns);

    data.forEach((d) => {
      const r = Math.floor((Number(d[rowKey]) - row.min) / rowStep);
      const c = Math.floor((Number(d[colKey]) - col.min) / colStep);
      bins[r][c]++;
    });

    return {
      bins,
      row,
      col,
    };
  }, [colKey, data, numOfColumns, numOfRows, rowKey]);

  return h;
}