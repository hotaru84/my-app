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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ZoomPlugin from 'chartjs-plugin-zoom';

import { AspectRatio, ButtonGroup, IconButton, ResponsiveValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { TbZoomOutArea } from "react-icons/tb";
import { TimeRangeTag } from "./TimeRangeTag";

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
  isActive: boolean;
  onChangeTimescale?: (timescale: [Date | undefined, Date | undefined]) => void;
}

const BarLineTimeChart: FC<BarLineTimeChartProps> = ({ ratio, isActive, onChangeTimescale }) => {
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [ratePoints, setRatePoints] = useState<Point[]>([]);
  const [errorPoints, setErrorPoints] = useState<Point[]>([]);
  const [totalPoints, setTotalPoints] = useState<Point[]>([]);

  const resetTimescale = useCallback(() => {
    chartRef?.current?.resetZoom();
    if (onChangeTimescale !== undefined) onChangeTimescale([undefined, undefined]);
  }, [onChangeTimescale]);

  const onChangeX = useCallback(({ chart }: { chart: ChartJS }) => {
    const { min, max } = chart.scales.x;
    if (onChangeTimescale !== undefined) onChangeTimescale([new Date(min), new Date(max)]);
  }, [onChangeTimescale]);

  useInterval(() => {
    console.log(isActive);
    if (!isActive) return;
    const total = Math.floor(Math.random() * 250 + 30);
    const err = Math.floor(Math.random() * 30);
    const now = new Date();
    setErrorPoints([
      ...errorPoints.length > 10 ? errorPoints.slice(1) : errorPoints,
      {
        x: now.getTime(),
        y: err,
      }
    ]);
    setTotalPoints([
      ...totalPoints.length > 10 ? totalPoints.slice(1) : totalPoints,
      {
        x: now.getTime(),
        y: total
      }
    ]);
    setRatePoints([
      ...ratePoints.length > 10 ? ratePoints.slice(1) : ratePoints,
      {
        x: now.getTime(),
        y: Math.floor((total - err) / total * 100),
      }
    ]);
  }, 1000);

  const data: ChartData<any> = useMemo(() => ({
    datasets: [
      {
        type: "line",
        label: "Rate(%)",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: ratePoints,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
      },
      {
        type: "bar",
        label: "Total count",
        data: totalPoints,
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
        data: errorPoints,
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
          order: 3
        },
      },
    ],
  }), [totalPoints, errorPoints, ratePoints]);

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
            mode: 'x',
            modifierKey: 'ctrl',
            onPanComplete: onChangeX
          },
          zoom: {
            drag: {
              enabled: true,
              backgroundColor: '#FF9F405f',
            },
            mode: 'x',
            onZoomComplete: onChangeX
          },
        }
      },
      scales: {
        x: {
          type: "time",
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
          max: 100,
          position: "left",
        },
      },
    }), [onChangeX]);

  return <motion.div layout>
    <ButtonGroup colorScheme="orange" isAttached variant={'ghost'}>
      <TimeRangeTag
        min={new Date(chartRef?.current?.scales.x.min ?? 0)}
        max={new Date(chartRef?.current?.scales.x.max ?? 0)}
        isActive={isActive}
      />
      {!isActive && <IconButton aria-label={"zoom-reset"} icon={<TbZoomOutArea />} size="sm" onClick={resetTimescale} />}
    </ButtonGroup>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} ref={chartRef} />
    </AspectRatio>
  </motion.div>;
};

export default BarLineTimeChart;
