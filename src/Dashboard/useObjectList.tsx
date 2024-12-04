import { useCallback, useMemo } from "react";
import { useList } from "react-use";

export interface ObjectAcccessor<T> {
  objectList: T[],
  push: (...v: T[]) => void;
  updateAt: (i: number, v: T) => void;
  getAt: (i: number) => T;
  getKeysAt: (i: number) => string[];
  updateKeysAt: (i: number, key: string | string[]) => void;
  mandatoryKeys: (keyof T)[];
  optionalKeys: (keyof T)[];
}

export function useObjectList<T extends object>(initObjList: T[], defaultObj: T, defaultMandatoryObj: T): ObjectAcccessor<T> {
  const [objectList, { push, updateAt }] = useList<T>(initObjList);
  const getAt = useCallback((i: number) => objectList[i], [objectList]);
  const getKeysAt = useCallback((i: number) => Object.keys(objectList[i]), [objectList]);
  const mandatoryKeys = useMemo(() => Object.keys(defaultMandatoryObj) as (keyof T)[], [defaultMandatoryObj]);
  const optionalKeys = useMemo(() => (Object.keys(defaultObj) as (keyof T)[]).filter(k => !mandatoryKeys.includes(k)), [defaultObj, mandatoryKeys]);

  const updateKeysAt = useCallback((index: number, key: string | string[]) => {
    const keys = (!Array.isArray(key) ? [key] : key) as (keyof T)[];
    const filter = { ...defaultMandatoryObj };

    keys.forEach((k) => {
      Object.defineProperty(filter,
        k,
        {
          value: getAt(index)[k] === undefined ? defaultObj[k] : getAt(index)[k],
          writable: true,
          enumerable: true,
          configurable: true
        });
    });
    updateAt(index, filter);
  }, [defaultObj, defaultMandatoryObj, getAt, updateAt]);

  return {
    objectList,
    push,
    updateAt,
    getAt,
    getKeysAt,
    updateKeysAt,
    mandatoryKeys,
    optionalKeys,
  }
}