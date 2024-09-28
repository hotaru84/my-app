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
import { Histgram2d } from "./useHistgram";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ZoomPlugin
);

interface ChartProps {
  ratio?: ResponsiveValue<number>;
  data: Histgram2d;
  rstep: number;
  cstep: number;
}

const HeatmapChart: FC<ChartProps> = ({ ratio, data: histgram, rstep, cstep }) => {
  const bins = histgram.bins;
  const data: ChartData<"bar"> = useMemo(() => {
    const histsMax = bins.flat().reduce((a, b) => Math.max(a, b));

    return {
      datasets: bins.map((row) => ({
        data: new Array(row.length).fill(rstep),
        backgroundColor: row.map(c => `hsl(185, 100%, 50%,${c / histsMax * 100}%)`),
        barPercentage: 0.999,
        categoryPercentage: 0.999,
      })),
      labels: bins.map((_, j) => j * cstep + histgram.col.min)
    }
  }, [bins, cstep, histgram.col.min, rstep]);

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
            stepSize: cstep,
          },
          min: histgram.col.min,
          stacked: true
        },
        y: {
          type: "linear",
          grid: {
            display: false,
          },
          ticks: {
            stepSize: rstep,
            callback(_, index) {
              return (index * rstep) + histgram.row.min;
            },
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
            title(items) {
              if (items.length > 0) {
                const r = items[0].datasetIndex;
                const c = items[0].dataIndex;
                return `${bins[r][c]} count`;
              }
            },
            label(ctx) {
              return (`r ${ctx.datasetIndex * rstep + histgram.row.min}mm c ${ctx.dataIndex * cstep + histgram.col.min}mm`)
            },
          }
        },
      }
    }), [bins, cstep, histgram.col.min, histgram.row.min, rstep]);

  return <motion.div layout>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} />
    </AspectRatio>
  </motion.div >;
};

export default HeatmapChart;
