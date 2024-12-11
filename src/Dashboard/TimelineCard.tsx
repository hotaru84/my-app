import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Point,
  LineElement,
  PointElement,
  TimeSeriesScale,
  ChartOptions,
  ChartData,
  ChartDataset,
  ChartEvent,
  ActiveElement,
  _adapters,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import ZoomPlugin from 'chartjs-plugin-zoom';

import { Box, VStack } from "@chakra-ui/react";
import { generateTimeseriesCfg, generateTimeseries } from "./timeseriesUtil";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { SampleData, SampleDataInfo, Timeframe } from "./SampleData";
import { validSampleData } from "./filterSampleData";
import { TimeRangeTag } from "../TimeRangeTag";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  ZoomPlugin
);

interface Props {
  info: SampleDataInfo;
  data: SampleData[];
  timeframe: Timeframe;
}

const TimelineCard: FC<Props> = ({ info, data, timeframe }) => {
  const [cfg, setCfg] = useState(generateTimeseriesCfg(timeframe));
  const line = generateTimeseries(
    data.filter(d => validSampleData(d, info.filter))
      .map(d => d.time), cfg);
  const lines: Point[] = [];

  const [hidden, setHidden] = useState<boolean[]>([false, false, true]);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const onChangeTimeframe = useCallback(({ chart }: { chart: ChartJS }) => {
    const { min, max } = chart.scales.x;
    chart.stop();
    setCfg(generateTimeseriesCfg({ start: new Date(min), end: new Date(max) }));
    chartRef.current?.zoomScale('x', {
      min: cfg.getDate(0).getTime(),
      max: cfg.getDate(cfg.binSize - 1).getTime()
    });
    chart.update('none');
  }, [cfg]);

  const onResetTimeframe = useCallback(() => {
    chartRef.current?.stop();
    setCfg(generateTimeseriesCfg(timeframe));
    chartRef.current?.zoomScale('x', {
      min: cfg.getDate(0).getTime(),
      max: cfg.getDate(cfg.binSize - 1).getTime()
    });
  }, [cfg, timeframe]);

  const isZoomed = useMemo(() => timeframe.start !== cfg.getDate(0) && timeframe.end !== cfg.getDate(cfg.binSize - 1),
    [cfg, timeframe.end, timeframe.start]);

  const chartdata: ChartData<"bar" | "line"> = useMemo(() => ({
    datasets: [
      {
        type: "bar",
        label: info.title,
        data: line,
        backgroundColor: "#63B3ED", //'#FF9F40'
        borderRadius: 8,
        yAxisID: "y",
        datalabels: {
          align: "start",
          anchor: "end",
          formatter: (value: Point) => {
            return value !== undefined && Math.round(value.y);
          },
          color: "whitesmoke",
          font: { size: 12, weight: "bold" },
        },
        order: 2,
      },
      {
        ...lines?.map(l => ({
          type: "line",
          label: "Rate(%)",
          borderColor: "#68D391",
          backgroundColor: "#68D391",
          data: l,
          yAxisID: "y1",
          datalabels: {
            display: false,
          },
          order: 1,
          hidden: hidden[0],
        }))
      }
    ] as ChartDataset<"bar" | "line">[],
  }), [info.title, line, hidden, lines]);

  const options: ChartOptions<"bar" | "line"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true
          },
          onClick(_, legendItem, legend) {
            setHidden(
              hidden.map((b, i) => (i === legendItem.datasetIndex) ? !b : b)
            );
            legend.chart.update();
          },
        },
        tooltip: {
          callbacks: {
            title: context => {
              const p = context[0].raw as Point;
              console.log(p.x);
              return format(new Date(p.x), 'PP p', { locale: ja })
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            modifierKey: 'ctrl',
            mode: 'x',
            onPanComplete: onChangeTimeframe
          },
          zoom: {
            drag: {
              enabled: true,
              backgroundColor: '#FF9F405f',
            },
            mode: 'x',
            onZoomComplete: onChangeTimeframe
          },
        }
      },

      scales: {
        x: {
          type: "timeseries",
          time: {
            displayFormats: {
              second: "pp",
              minute: "p",
              hour: 'Mo do p',
              day: 'PP'
            },
          },
          grid: {
            display: false,
          },
          stacked: true,
          adapters: {
            date: {
              locale: ja,
            }
          }
        },
        y: {
          type: "linear",
          position: "right",
          display: false,
          grid: {
            display: false,
          },
          stacked: true,
        },
        y1: {
          type: "linear",
          max: 100,
          position: "left",
        },
      },
      onClick: (_event: ChartEvent, el: ActiveElement[], chart: ChartJS) => {
        if (el.length === 0) {
          //resetTimescale();
        }
      },
    }), [hidden, onChangeTimeframe]);

  return <VStack w="full" h="full" p={4} gap={0} align={"start"}>
    <TimeRangeTag min={cfg.getDate(0)} max={cfg.getDate(cfg.binSize - 1)} isZoom={isZoomed} onClick={onResetTimeframe} />

    <Box w="full" h="full">
      <Chart type={"bar"} options={options} data={chartdata} ref={chartRef} />
    </Box>
  </VStack>;
};

export default TimelineCard;
