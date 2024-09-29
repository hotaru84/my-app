import { FC, useMemo } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
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
}

const HeatmapChart: FC<ChartProps> = ({ ratio, data: histgram }) => {
  const bins = histgram.bins;
  const rstep = Math.ceil((histgram.row.max - histgram.row.min) / bins.length);
  const cstep = Math.ceil((histgram.col.max - histgram.col.min) / bins[0].length);
  const data: ChartData<"bar"> = useMemo(() => {
    const histsMax = bins.flat().reduce((a, b) => Math.max(a, b));
    return {
      datasets: bins.map((col) => {
        return {
          data: col.map(_ => rstep),
          backgroundColor: col.map(c => `hsl(185, 100%, 50%,${c / histsMax * 100}%)`),
          barPercentage: 0.999,
          categoryPercentage: 0.999,
        }
      }),
      labels: bins[0].map((_, j) => j * cstep + histgram.col.min)
    }
  }, [bins, rstep, cstep, histgram.col.min]);

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
            callback(_, index) {
              return (index * cstep) + histgram.col.min;
            },
          },
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
              return (`r ${ctx.datasetIndex} c ${ctx.dataIndex}`)
            },
          }
        },
      }
    }), [bins, cstep, histgram.col.min, histgram.row.min, rstep]);

  return <motion.div layout>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} />
    </AspectRatio>
  </motion.div>;
};

export default HeatmapChart;
