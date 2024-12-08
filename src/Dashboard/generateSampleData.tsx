import { addSeconds, differenceInSeconds } from "date-fns";
import { SampleData, Timeframe } from "./SampleData";

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
  const diffSec = Math.max(
    Math.floor(
      differenceInSeconds(tf.end, tf.start) / tf.slot
    ), 1);

  return [...Array(count)].map((_, i): SampleData => ({
    time: addSeconds(tf.start, diffSec * i),
    resultCode: generateRandomNumArray(),
    errorCode: generateRandomNumArray(),
    cfgs: generateRandomNumArray(),
    units: generateRandomStrArray(),
    size: Math.round(generateGaussianNumber(100)),
    a: Math.round(generateGaussianNumber(100)),
    w: Math.round(generateGaussianNumber(400)),
    h: Math.round(generateGaussianNumber(400)),
    l: Math.round(generateGaussianNumber(400)),
    len: Math.round(generateGaussianNumber(400)),
    leGap: Math.round(generateGaussianNumber(800)),
    teGap: Math.round(generateGaussianNumber(800)),
    speed: Math.random() * 400 + 800,
    outdata: generateRandomString(),
    comment: generateRandomString()
  }));
}


