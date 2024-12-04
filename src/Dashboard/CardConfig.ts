const CardTypes = {
  counter: 'count',
  rate: 'rate',
  elapsed: 'elapsed',
  timeline: 'timeline',
  images: 'images',
  stats: 'stats',
  table: 'table',
  histgram: 'histgram',
  heatmap: 'heatmap'
} as const;
export type CardType = typeof CardTypes[keyof typeof CardTypes];
export const CardTypeList = Object.values(CardTypes);

const CardValueTypes = {
  resultCode: 'resultCode',
  errorCode: "errorCode",
  codeCfg: "codeCfg",
  units: "units",
  codeSize: "codeSize",
  capturability: "capturability",
  decodability: "decodability",
  reliability: "reliability",
  w: "w",
  h: "h",
  l: "l",
  len: "len",
  leGap: "leGap",
  teGap: "teGap",
  speed: "speed",
  outdata: "outdata",
  comment: "comment",
} as const;
export type CardValueType = typeof CardValueTypes[keyof typeof CardValueTypes];
export const CardValueTypeList = Object.values(CardValueTypes);

export type RangeFilterProps = {
  max: number;
  min: number;
  isNot: boolean;
}

export type CardFilter = {
  title: string;
  resultCode?: number[]; // or
  errorCode?: number[]; // or
  codeCfg?: number[];
  units?: number[];
  codeSize?: RangeFilterProps;
  capturability?: RangeFilterProps;
  decodability?: RangeFilterProps;
  reliability?: RangeFilterProps;
  w?: RangeFilterProps;
  h?: RangeFilterProps;
  l?: RangeFilterProps;
  len?: RangeFilterProps;
  leGap?: RangeFilterProps;
  teGap?: RangeFilterProps;
  speed?: RangeFilterProps;
  outdata?: string;
  comment?: string;
}
export const mandatoryCardFilter: CardFilter = {
  title: ''
};
export const defaultCardFilter: CardFilter = {
  title: '',
  resultCode: [],
  errorCode: [],
  codeCfg: [],
  units: [],
  codeSize: {
    min: 0,
    max: 100,
    isNot: false
  },
  capturability: {
    min: 0,
    max: 100,
    isNot: false
  },
  decodability: {
    min: 0,
    max: 100,
    isNot: false
  },
  reliability: {
    min: 0,
    max: 100,
    isNot: false
  },
  w: {
    min: 0,
    max: 100,
    isNot: false
  },
  h: {
    min: 0,
    max: 100,
    isNot: false
  },
  l: {
    min: 0,
    max: 100,
    isNot: false
  },
  len: {
    min: 0,
    max: 100,
    isNot: false
  },
  leGap: {
    min: 0,
    max: 100,
    isNot: false
  },
  teGap: {
    min: 0,
    max: 100,
    isNot: false
  },
  speed: {
    min: 0,
    max: 100,
    isNot: false
  },
  outdata: '',
  comment: ''
};

export type CardInfo = {
  label: string;
  unit?: string;
  color?: string;
  emphasize?: true;
}

