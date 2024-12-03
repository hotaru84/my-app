import { useCallback, useMemo } from "react";
import { useList, useLocalStorage } from "react-use";

export interface ObjectAcccessor<T> {
  list: T[],
  push: (...v: T[]) => void;
  updateAt: (i: number, v: T) => void;
  getAt: (i: number) => T;
  getKeysAt: (i: number) => string[];
  updateKeysAt: (i: number, key: string | string[]) => void;
  save: () => void;
  len: number;
  requiredkeys: (keyof T)[];
  nonRequiredkeys: (keyof T)[];
}

export function useObjectAcccessor<T extends object>(storedName: string, defaultFull: T, defaultRequired: T): ObjectAcccessor<T> {
  const [storedList, store] = useLocalStorage<T[]>(storedName);
  const [list, { push, updateAt }] = useList<T>(storedList !== undefined ? storedList : []);

  const getAt = useCallback((i: number) => list[i], [list]);
  const getKeysAt = useCallback((i: number) => Object.keys(list[i]), [list]);
  const len = useMemo(() => list.length, [list.length]);
  const save = useCallback(() => store(list), [list, store]);
  const requiredkeys = useMemo(() => Object.keys(defaultRequired) as (keyof T)[], [defaultRequired]);
  const nonRequiredkeys = useMemo(() => (Object.keys(defaultFull) as (keyof T)[]).filter(k => !requiredkeys.includes(k)), [defaultFull, requiredkeys]);

  const updateKeysAt = useCallback((index: number, key: string | string[]) => {
    const keys = (!Array.isArray(key) ? [key] : key) as (keyof T)[];
    const filter = { ...defaultRequired };

    keys.forEach((k) => {
      Object.defineProperty(filter,
        k,
        {
          value: getAt(index)[k] === undefined ? defaultFull[k] : getAt(index)[k],
          writable: true,
          enumerable: true,
          configurable: true
        });
    });
    updateAt(index, filter);
  }, [defaultFull, defaultRequired, getAt, updateAt]);

  return {
    list,
    push,
    updateAt,
    getAt,
    getKeysAt,
    updateKeysAt,
    len,
    save,
    requiredkeys,
    nonRequiredkeys,
  }
}