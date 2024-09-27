import { useMemo } from "react";

type Slot = {
  min: number;
  max: number;
  step: number;
};

export type Histgram = {
  bins: number[][];
  row: Slot;
  col: Slot;
};

export const useHistgram = <T, R extends keyof T, C extends keyof T>(
  data: T[],
  rowKey: R,
  rowStep: number,
  colKey: C,
  colStep: number
): Histgram => {

  const h = useMemo(() => {
    const [row, col] = data.reduce<[Slot, Slot]>((s, d) => (
      [{
        max: Math.floor(Math.max(s[0].max, Number(d[rowKey])) / rowStep) * rowStep,
        min: Math.floor(Math.min(s[0].min, Number(d[rowKey])) / rowStep) * rowStep,
        step: rowStep
      }, {
        max: Math.floor(Math.max(s[1].max, Number(d[colKey])) / colStep) * colStep,
        min: Math.floor(Math.min(s[1].min, Number(d[colKey])) / colStep) * colStep,
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