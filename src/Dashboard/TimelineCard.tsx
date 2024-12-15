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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import ZoomPlugin from 'chartjs-plugin-zoom';

import { Box, ButtonGroup, IconButton, useDisclosure, VStack } from "@chakra-ui/react";
import { ja } from "date-fns/locale";
import { addDays, differenceInDays, format, startOfDay } from "date-fns";
import { SampleData, SampleDataInfo } from "./SampleData";
import { validSampleData } from "./filterSampleData";
import { TimeRangeTag } from "../TimeRangeTag";
import { useTimeframe } from "../useTimeframe";
import { TbArrowLeft, TbArrowRight, TbZoomIn, TbZoomInArea, TbZoomOut } from "react-icons/tb";

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
}

const TimelineCard: FC<Props> = ({ info, data }) => {
  const simplified = false;
  const { isOpen: isZoom, onToggle: onToggleZoom } = useDisclosure();
  const { timeframe, timeToPoint, onChangeTimeframe, zoomIn, zoomOut, prev, next } = useTimeframe();
  const line = useMemo(() => timeToPoint(
    data.filter(d => validSampleData(d, info.filter)).map(d => d.time)), [data, info.filter, timeToPoint]);

  const lines: Point[] = [];

  const [hidden, setHidden] = useState<boolean[]>([false, false, true]);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const onChange = useCallback(({ chart }: { chart: ChartJS }) => {
    const { min, max } = chart.scales.x;
    chart.stop();
    onChangeTimeframe({ ...timeframe, start: new Date(min), end: new Date(max) });
    chart.update('none');
  }, [onChangeTimeframe, timeframe]);

  const chartdata: ChartData<"bar" | "line"> = useMemo(() => ({
    datasets: [
      {
        type: "bar",
        label: info.title,
        data: line,
        backgroundColor: "#63B3ED", //'#FF9F40'
        borderRadius: 8,
        hoverBackgroundColor: '#FF9F405f',
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
      }, ...lines?.map(l => ({
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
    ] as ChartDataset<"bar" | "line">[],
  }), [info.title, line, hidden, lines]);

  const options: ChartOptions<"bar" | "line"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: !simplified,
          position: "bottom",
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
          enabled: !simplified,
          callbacks: {
            title: context => {
              const p = context[0].raw as Point;
              return format(new Date(p.x), 'PP p', { locale: ja })
            }
          }
        },
        zoom: {
          pan: {
            enabled: !isZoom,
            mode: 'x',
            scaleMode: 'x',
            onPanComplete: onChange
          },
          zoom: {
            pinch: {
              enabled: isZoom
            },
            drag: {
              enabled: isZoom,
              backgroundColor: '#FF9F405f',
            },
            mode: 'x',
            onZoomComplete: onChange
          }
        }
      },

      scales: {
        x: {
          type: "time",
          display: !simplified,
          time: {
            minUnit: timeframe.unit,
            displayFormats: {
              second: "pp",
              minute: "p",
              hour: 'Mo do p',
              day: 'PP',
              week: 'PP',
              month: 'y MMM',
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
          },
          min: timeframe.start.getTime(),
          max: timeframe.end.getTime()
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
          display: !simplified,
          position: "left",
          grid: {
            display: !simplified,
          },
        },
      },
      onClick: (_event: ChartEvent, el: ActiveElement[], chart: ChartJS) => {
        if (el.length === 0) {
          //resetTimescale();

        }
      },

    }), [simplified, isZoom, onChange, timeframe.unit, timeframe.start, timeframe.end, hidden]);



  return <VStack w="full" h="full" p={4} gap={1} align={"start"}>
    <TimeRangeTag isZoom={isZoom} onToggleZoom={onToggleZoom} />
    <Box w="full" h="full">
      <Chart type={"bar"} options={options} data={chartdata} ref={chartRef} />
    </Box>
  </VStack>;
};

export default TimelineCard;
