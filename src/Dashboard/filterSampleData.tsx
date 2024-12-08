import { SampleData, SampleDataFilter } from "./SampleData";

function invalidRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && max !== undefined) {
    if (min === max) return min !== value;
    else if (min < max && (value < min || value > max)) return true;
    else if (min > max && (value > min || value < max)) return true;
  } else if (min === undefined && max === undefined) {
    return false;
  } else if (min !== undefined && max === undefined) {
    return value < min;
  } else if (max !== undefined && min === undefined) {
    return value > max;
  }

  return false;
}
function invalidNumArray(value: number[], filter?: number[]): boolean {
  if (filter === undefined) return false;
  if (filter.length > 0 && value.length > 0) return !value.some(v => filter.findIndex(f => f === v) < 0);
  return true;
}
function invalidNumString(value: string[], filter?: string[]): boolean {
  if (filter === undefined) return false;
  if (filter.length > 0 && value.length > 0) return !value.some(v => filter.findIndex(f => f === v) < 0);
  return true;
}


export function validSampleData(f: SampleDataFilter, d: SampleData): boolean {
  if (invalidRange(d.a, f.aMin, f.aMax)) return false;
  if (invalidRange(d.h, f.hMin, f.hMax)) return false;
  if (invalidRange(d.l, f.lMin, f.lMax)) return false;
  if (invalidRange(d.w, f.wMin, f.wMax)) return false;
  if (invalidRange(d.leGap, f.leGapMin, f.leGapMax)) return false;
  if (invalidRange(d.len, f.leGapMin, f.leGapMax)) return false;
  if (invalidRange(d.size, f.sizeMin, f.sizeMax)) return false;
  if (invalidRange(d.speed, f.speedMin, f.speedMax)) return false;
  if (invalidRange(d.teGap, f.teGapMin, f.teGapMax)) return false;

  if (invalidNumArray(d.cfgs, f.cfgs)) return false;
  if (invalidNumArray(d.resultCode, f.resultCode)) return false;
  if (invalidNumArray(d.errorCode, f.errorCode)) return false;
  if (invalidNumString(d.units, f.units)) return false;

  if (f.outdata && !d.outdata.includes(f.outdata)) return false;
  if (f.comment && !d.comment.includes(f.comment)) return false;

  return true;
}