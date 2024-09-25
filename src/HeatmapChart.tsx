import { FC, useMemo } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
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

interface ChartProps {
  ratio?: ResponsiveValue<number>;
  hists: number[][];
  rowstep: number;
  colstep: number;
}

const HeatmapChart: FC<ChartProps> = ({ ratio, hists, rowstep, colstep }) => {

  const data: ChartData<"bar"> = useMemo(() => ({
    datasets: hists.map((row) => ({
      data: new Array(row.length).fill(rowstep),
      backgroundColor: row.map((c) => `hsl(${240 - (c * 10)}, 100%, 50%,50%)`),
      barPercentage: 0.999,
      categoryPercentage: 0.999,
    })),
    labels: hists.map((_, j) => j * colstep)
  }), [colstep, hists, rowstep]);

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
            stepSize: colstep,
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
            stepSize: rowstep
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
              return `${ctx.datasetIndex} ${ctx.dataIndex} ${hists[ctx.datasetIndex][ctx.dataIndex]}`
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
