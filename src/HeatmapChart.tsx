import { FC, useMemo } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ChartDataset,
  ChartEvent,
  ActiveElement,
  BubbleDataPoint,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import ZoomPlugin from 'chartjs-plugin-zoom';

import { AspectRatio, ResponsiveValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ZoomPlugin
);

interface BubbleChartProps {
  ratio?: ResponsiveValue<number>;
}

const HeatmapChart: FC<BubbleChartProps> = ({ ratio }) => {
  const w = 50;
  const h = 50;
  const wstep = 10;
  const hstep = 10;

  const data: ChartData<"bar"> = useMemo(() => ({
    datasets: [...Array(h)].map((_, i): ChartDataset<'bar'> => (
      {
        label: `${wstep * i}`,
        data: [...Array(w).fill(hstep)],
        backgroundColor(ctx) {
          const j = ctx.dataIndex;
          const v = 240 - (Math.random() + j * 10);
          return `hsl(${v}, 100%, 50%,50%)`;
        },
        barPercentage: 0.999,
        categoryPercentage: 0.999,
      }
    )),
    labels: [...Array(w * h)].map((_, i) => Math.floor(i / w) * wstep + (i % w) * wstep)
  }), []);

  const options: ChartOptions<"bar"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          grid: {
            display: false,
          },
          ticks: {
            stepSize: wstep,
          },
          beginAtZero: true,
          stacked: true,
        },
        y: {
          type: "linear",
          grid: {
            display: false,
          },
          ticks: {
            stepSize: hstep
          },
          stacked: true,
        },
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return `${ctx.datasetIndex} ${ctx.dataIndex}`
            },
          }
        },
      }
    }), []);

  return <motion.div layout>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} />
    </AspectRatio>
  </motion.div >;
};

export default HeatmapChart;
