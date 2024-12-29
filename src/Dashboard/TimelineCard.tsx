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
import ZoomPlugin, { resetZoom } from 'chartjs-plugin-zoom';

import { Box, IconButton, useDisclosure, VStack } from "@chakra-ui/react";
import { ja } from "date-fns/locale";
import { format, formatDistanceStrict } from "date-fns";
import { SampleData, SampleDataInfo } from "./SampleData";
import { validSampleData } from "./filterSampleData";
import { useTimeframe } from "../useTimeframe";
import { MdZoomInMap } from "react-icons/md";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useChartZoom } from "./useChartZoom";


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
  ZoomPlugin,
  ChartDataLabels,
  annotationPlugin
);

interface Props {
  info: SampleDataInfo;
  data: SampleData[];
}

const TimelineCard: FC<Props> = ({ info, data }) => {
  const simplified = false;
  const { isZoom, onToggleZoom, min, max, isInZoomRange, setZoomStart, setZoomEnd, resetZoom } = useChartZoom();

  const { timeframe, timescale, timeToPoint, onScaleChange } = useTimeframe();
  const line = useMemo(() => timeToPoint(
    data.filter(d => validSampleData(d, info.filter)).map(d => d.time)), [data, info.filter, timeToPoint]);

  const label = useMemo(() => {
    return formatDistanceStrict(min, max);
  }, [max, min]);

  const lines: Point[] = [];

  const [hidden, setHidden] = useState<boolean[]>([false, false, true]);
  const chartRef = useRef<ChartJS<"bar">>(null);

  const onChange = useCallback(() => {

    onScaleChange(new Date(min), new Date(max));
    resetZoom();
  }, [max, min, onScaleChange, resetZoom]);


  const chartdata: ChartData<"bar" | "line"> = useMemo(() => ({
    datasets: [
      {
        type: "bar",
        label: info.title,
        data: line,
        backgroundColor: ({ dataIndex }) => {
          return dataIndex < line.length && isInZoomRange(line[dataIndex].x) ? '#FF9F40ee' : '#63B3ED';
        },
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
  }), [info.title, line, lines, isInZoomRange, hidden]);

  const options: ChartOptions<"bar" | "line"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'x',
      },
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
          xAlign: "center",
          yAlign: "center",
          callbacks: {
            title: context => {
              const p = context[0].raw as Point;
              return format(new Date(p.x), 'PP p', { locale: ja })
            }
          }
        },
        annotation: {
          animations: {
            numbers: {
              duration: 200
            }
          },
          annotations: {
            indicator: {
              init: () => ({ centerX: 0 }),
              type: min > 0 ? "box" : "line",
              xMin: min > 0 ? min : max,
              xMax: max,
              borderDash: [2, 2],
              borderWidth: isZoom ? 1 : 0,
              borderColor: '#FF9F40',
              backgroundColor: isZoom ? '#FF9F4033' : 'transparent',
              label: {
                display: min > 0,
                content: label,
                textAlign: "start",
                color: "gray",

                font: { size: 18, weight: "bold" },
              }
            },
          }
        },
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
          min: timescale.min,
          max: timescale.max,
        },
        y: {
          type: "linear",
          position: "right",
          display: false,
          grid: {
            display: false,
          },
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
      onClick: (evt, el, chart) => {
        if (evt.native == null || !isZoom) return;
        const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
        if (points.length > 0) {

          if (min === 0) setZoomEnd(line[points[0].index].x);
          else onChange();
        }
      },
      onHover: (evt, el, chart) => {
        if (evt.native == null || !isZoom) return;
        const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
        if (points.length > 0) {
          if (min === 0) setZoomStart(line[points[0].index].x);
          else setZoomEnd(line[points[0].index].x);
        }
      }
    }), [simplified, min, max, isZoom, timeframe.unit, timescale.min, timescale.max, hidden, setZoomEnd, line, onChange, setZoomStart]);



  return <VStack w="full" h="full" p={4} gap={1} align={"start"}>
    <IconButton aria-label={""} icon={<MdZoomInMap />} onClick={onToggleZoom} isActive={isZoom} position={"absolute"} bottom={2} left={2} />
    <Box w="full" h="full">
      <Chart type={"bar"} options={options} data={chartdata} ref={chartRef} />
    </Box>
  </VStack>;
};

export default TimelineCard;
