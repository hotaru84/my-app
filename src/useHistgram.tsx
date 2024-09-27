import { useMemo } from "react";

type Slot = {
  min: number;
  max: number;
  step: number;
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
  rowStep: number
): Histgram => {

  const h = useMemo(() => {
    const row = data.reduce<Slot>((r, d) => (
      {
        max: Math.floor(Math.max(r.max, Number(d[rowKey])) / rowStep) * rowStep,
        min: Math.floor(Math.min(r.min, Number(d[rowKey])) / rowStep) * rowStep,
        step: rowStep
      }
    ), { max: 0, min: Infinity, step: 0 });

    const numOfRows = Math.floor((row.max - row.min) / row.step) + 1;
    const bins = [...Array<number>(numOfRows)].fill(0);

    data.forEach((d) => {
      const r = Math.floor((Number(d[rowKey]) - row.min) / row.step);
      if (r < numOfRows) bins[r]++;
    });

    return {
      bins,
      row,
    };
  }, [data, rowKey, rowStep]);

  return h;
}

export const useHistgram2d = <T, R extends keyof T, C extends keyof T>(
  data: T[],
  rowKey: R,
  rowStep: number,
  colKey: C,
  colStep: number
): Histgram2d => {

  const h = useMemo(() => {
    const [row, col] = data.reduce<[Slot, Slot]>(([r, c], d) => (
      [{
        max: Math.floor(Math.max(r.max, Number(d[rowKey])) / rowStep) * rowStep,
        min: Math.floor(Math.min(r.min, Number(d[rowKey])) / rowStep) * rowStep,
        step: rowStep
      }, {
        max: Math.floor(Math.max(c.max, Number(d[colKey])) / colStep) * colStep,
        min: Math.floor(Math.min(c.min, Number(d[colKey])) / colStep) * colStep,
        step: colStep
      }]
    ), [{ max: 0, min: Infinity, step: 0 }, { max: 0, min: Infinity, step: 0 }]);

    const numOfRows = Math.floor((row.max - row.min) / row.step) + 1;
    const numOfColumns = Math.floor((col.max - col.min) / col.step) + 1;
    const bins = [...Array<number>(numOfRows)].map(_ => [...Array<number>(numOfColumns)].fill(0));

    data.forEach((d) => {
      const r = Math.floor((Number(d[rowKey]) - row.min) / row.step);
      const c = Math.floor((Number(d[colKey]) - col.min) / col.step);
      if (r < numOfRows && c < numOfColumns) bins[r][c]++;
    });

    return {
      bins,
      row,
      col,
    };
  }, [colKey, colStep, data, rowKey, rowStep]);

  return h;
}