import { FC, useMemo, useRef, useState } from "react";
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

import { Box } from "@chakra-ui/react";
import { useTimeline } from "./useTimeline";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { SampleData, SampleDataInfo, Timeframe } from "./SampleData";
import { validSampleData } from "./filterSampleData";

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
  const timeline = useTimeline(
    data.filter(d => validSampleData(d, info.filter))
      .map(d => d.time), timeframe);
  const timeline1 = useTimeline(
    info.filter1 ? data.filter(d => validSampleData(d, info.filter1))
      .map(d => d.time) : [], timeframe);
  const timeline2 = useTimeline(
    info.filter2 ? data.filter(d => validSampleData(d, info.filter2))
      .map(d => d.time) : [], timeframe);

  const [hidden, setHidden] = useState<boolean[]>([false, false, true]);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const chartdata: ChartData<"bar" | "line"> = useMemo(() => ({
    datasets: [
      {
        type: "bar",
        label: "Total count",
        data: timeline,
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
        hidden: hidden[1],
      },
      {
        type: "line",
        label: "Rate(%)",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: timeline1,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
        order: 1,
        hidden: hidden[0],
      },
      {
        type: "line",
        label: "Error count",
        backgroundColor: "#ff6384",
        data: timeline2,
        yAxisID: "y",
        datalabels: {
          display: false,
          align: "end",
          anchor: "end",
          formatter: (value: Point) => {
            return Math.round(value.y);
          },
          color: "#ff6384",
          font: { size: 12, weight: "bold" },
        },
        order: 0,
        hidden: hidden[2],
      },
    ] as ChartDataset<"bar" | "line">[],
  }), [timeline, hidden, timeline1, timeline2]);

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
          limits: {
            x: { minRange: 1000 * 30 },//seconds, min: -200, max: 200,
          },
          pan: {
            enabled: true,
            modifierKey: 'ctrl',
            mode: 'x',
          },
          zoom: {
            drag: {
              enabled: true,
              backgroundColor: '#FF9F405f',
            },
            mode: 'x',
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
    }), [hidden]);

  return <Box w="full" h="full">
    <Chart type={"bar"} options={options} data={chartdata} ref={chartRef} />
  </Box>;
};

export default TimelineCard;
