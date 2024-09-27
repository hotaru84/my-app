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
import { Histgram } from "./useHistgram";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ZoomPlugin
);

interface ChartProps {
  ratio?: ResponsiveValue<number>;
  data: Histgram;
}

const HistgramChart: FC<ChartProps> = ({ ratio, data: histgram }) => {
  const bins = histgram.bins;
  const data: ChartData<"bar"> = useMemo(() => ({
    datasets: [{
      borderColor: "#68D391",
      backgroundColor: "#68D391",
      barPercentage: 0.99,
      categoryPercentage: 0.99,
      data: bins,
    }],
    labels: bins.map((_, i) => i * histgram.row.step + histgram.row.min)
  }), [bins, histgram.row.min, histgram.row.step]);

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
            stepSize: histgram.row.step,
          },
          min: histgram.row.min,
          max: histgram.row.max
        },
        y: {
          type: "linear",
          grid: {
            display: true,
          },
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
                const c = items[0].dataIndex;
                return `${bins[c]} count`;
              }
            },
            label(ctx) {
              return (`r ${ctx.dataIndex * histgram.row.step + histgram.row.min}`)
            },
          }
        },
      }
    }), [bins, histgram.row.max, histgram.row.min, histgram.row.step]);

  return <motion.div layout>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} />
    </AspectRatio>
  </motion.div >;
};

export default HistgramChart;
