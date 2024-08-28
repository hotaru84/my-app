import { FC, useCallback, useMemo, useRef } from "react";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import ZoomPlugin from 'chartjs-plugin-zoom';

import { AspectRatio, ButtonGroup, ResponsiveValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { TimeRangeTag } from "./TimeRangeTag";
import { TimelineStats } from "./useTimelineStats";

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
  ChartDataLabels,
  ZoomPlugin
);

interface BarLineTimeChartProps {
  ratio?: ResponsiveValue<number>;
  timeline: TimelineStats
}

const BarLineTimeChart: FC<BarLineTimeChartProps> = ({ ratio, timeline }) => {
  const chartRef = useRef<ChartJS<"bar">>(null);

  const resetTimescale = useCallback(() => {
    chartRef?.current?.resetZoom();
    timeline.resetScale();
  }, [timeline]);

  const onChangeTimescale = useCallback(({ chart }: { chart: ChartJS }) => {
    const { min, max } = chart.scales.x;
    timeline.setScale({ start: new Date(min), end: new Date(max) });
  }, [timeline]);


  const data: ChartData<"bar" | "line"> = useMemo(() => ({
    datasets: [
      {
        type: "line",
        label: "Rate(%)",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: timeline.ratePoints,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
      },
      {
        type: "bar",
        label: "Total count",
        data: timeline.totalPoints,
        backgroundColor: "#63B3ED", //'#FF9F40'
        borderRadius: 8,
        yAxisID: "y",
        order: 2,
        datalabels: {
          align: "start",
          anchor: "end",
          formatter: (value: Point) => {
            return value !== undefined && Math.round(value.y);
          },
          color: "whitesmoke",
          font: { size: 12, weight: "bold" },
        },
      },
      {
        type: "line",
        label: "Error count",
        backgroundColor: "#ff6384",
        data: timeline.errorPoints,
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
          order: 3,
        },
        hidden: true,
      },
    ] as ChartDataset<"bar" | "line">[],
  }), [timeline.ratePoints, timeline.totalPoints, timeline.errorPoints]);

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
          }
        },
        zoom: {
          limits: {
            x: { minRange: 1000 },//seconds, min: -200, max: 200,
          },
          pan: {
            enabled: true,
            modifierKey: 'ctrl',
            mode: 'x',
            onPanComplete: onChangeTimescale
          },
          zoom: {
            drag: {
              enabled: true,
              backgroundColor: '#FF9F405f',
            },
            mode: 'x',
            onZoomComplete: onChangeTimescale
          },
        }
      },
      scales: {
        x: {
          type: "timeseries",
          time: {
            unit: "second",
          },
          grid: {
            display: false,
          },
          stacked: true
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
          max: 105,
          position: "left",
          ticks: {
            callback: (v, i) => v <= 100 ? v : '',
          }
        },
      },
      onClick: (_event: ChartEvent, el: ActiveElement[], chart: ChartJS) => {
        if (el.length === 0) {
          //resetTimescale();
        }
      },
    }), [onChangeTimescale]);

  return <motion.div layout>
    <ButtonGroup colorScheme="orange" variant={'ghost'}>

      <TimeRangeTag
        min={new Date(chartRef?.current?.scales.x.min ?? 0)}
        max={new Date(chartRef?.current?.scales.x.max ?? 0)}
        isActive={isActive}
        onClose={resetTimescale}
      />
    </ButtonGroup>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} ref={chartRef} />
    </AspectRatio>
  </motion.div >;
};

export default BarLineTimeChart;
