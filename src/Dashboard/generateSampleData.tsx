import { addSeconds, differenceInSeconds } from "date-fns";
import { SampleData } from "./SampleData";
import { Timeframe } from "../useTimeframe";

function generateGaussianNumber(mean = 0, stdev = 1): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}
function generateRandomString(charCount = 7): string {
  const str = Math.random().toString(36).substring(2).slice(-charCount)
  return str.length < charCount ? str + 'a'.repeat(charCount - str.length) : str
}
function generateRandomNumArray(max = 10): number[] {
  const len = Math.floor(Math.random() * max);
  return [...Array(len)].map(_ => Math.floor(Math.random() * 10));
}
function generateRandomStrArray(max = 10): string[] {
  const len = Math.floor(Math.random() * max);
  return [...Array(len)].map(_ => generateRandomString());
}

export const generateSampleData = (tf: Timeframe, count: number): SampleData[] => {
  const timeRange = Math.max(
    Math.floor(
      differenceInSeconds(tf.end, tf.start)
    ), 1);

  return [...Array(count)].map((_, i): SampleData => ({
    time: addSeconds(tf.start, Math.random() * timeRange),
    resultCode: generateRandomNumArray(),
    errorCode: generateRandomNumArray(),
    cfgs: generateRandomNumArray(),
    units: generateRandomStrArray(),
    size: Math.round(generateGaussianNumber(100, 50)),
    a: Math.round(generateGaussianNumber(100, 50)),
    w: Math.round(generateGaussianNumber(400, 200)),
    h: Math.round(generateGaussianNumber(400, 200)),
    l: Math.round(generateGaussianNumber(400, 200)),
    len: Math.round(generateGaussianNumber(400, 200)),
    leGap: Math.round(generateGaussianNumber(800, 400)),
    teGap: Math.round(generateGaussianNumber(800, 400)),
    speed: Math.random() * 400 + 800,
    outdata: generateRandomString(),
    comment: generateRandomString()
  }));
}


