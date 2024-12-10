import { Layout } from "react-grid-layout";

export const SampleDataTypes = {
  counter: 'counter',
  ratio: 'ratio',
  elapsed: 'elapsed',
  timeline: 'timeline',
  gallery: 'gallery',
  stats: 'stats',
  table: 'table',
  histgram: 'histgram',
  heatmap: 'heatmap'
} as const;
export type SampleDataType = typeof SampleDataTypes[keyof typeof SampleDataTypes];
export const SampleDataTypesList = Object.values(SampleDataTypes);

export type Timeframe = {
  start: Date;
  end: Date;
  slot: number;
}

export type SampleData = {
  time: Date,
  resultCode: number[]; // or
  errorCode: number[]; // or
  cfgs: number[];
  units: string[];
  size: number;
  a: number;
  w: number;
  h: number;
  l: number;
  len: number;
  leGap: number;
  teGap: number;
  speed: number;
  outdata: string;
  comment: string;
}
export const ResultCodeList = ['success', 'error', 'warning'];
export const ErrorCodeList = ['system', 'operation', 'unknown']

export type SampleDataFilter = {
  resultCode?: number[]; // or
  errorCode?: number[]; // or
  cfgs?: number[];
  units?: string[];
  sizeMin?: number;
  sizeMax?: number;
  aMin?: number;
  aMax?: number;
  wMin?: number;
  wMax?: number;
  hMin?: number;
  hMax?: number;
  lMin?: number;
  lMax?: number;
  lenMin?: number;
  lenMax?: number;
  leGapMin?: number;
  leGapMax?: number;
  teGapMin?: number;
  teGapMax?: number;
  speedMin?: number;
  speedMax?: number;
  outdata?: string;
  comment?: string;
}
export type SampleDataInfo = {
  title: string;
  unit: string;
  type: SampleDataType;
  filter: SampleDataFilter;
  filters?: SampleDataFilter[];
  layout: Layout;
}

export const defaultSampleDataFilter: SampleDataFilter = {
  resultCode: [],
  errorCode: [],
  cfgs: [],
  units: [],
  sizeMin: 0,
  sizeMax: 1000,
  aMin: 0,
  aMax: 1000,
  wMin: 0,
  wMax: 10000,
  hMin: 0,
  hMax: 10000,
  lMin: 0,
  lMax: 10000,
  lenMin: 0,
  lenMax: 10000,
  leGapMin: 0,
  leGapMax: 10000,
  teGapMin: 0,
  teGapMax: 10000,
  speedMin: 0,
  speedMax: 10000,
  outdata: '',
  comment: ''
};
