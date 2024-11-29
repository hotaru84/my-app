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

import { Histgram } from "./useHistgram";
import { Box } from "@chakra-ui/react";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ZoomPlugin
);

interface ChartProps {
  data: Histgram;
}

const HistgramChart: FC<ChartProps> = ({ data: histgram }) => {
  const bins = histgram.bins;
  const step = Math.floor((histgram.row.max - histgram.row.min) / bins.length);

  const data: ChartData<"bar"> = useMemo(() => ({
    datasets: [{
      borderColor: "#68D391",
      backgroundColor: "#68D391",
      barPercentage: 0.99,
      categoryPercentage: 0.99,
      data: bins,
    }],
    labels: bins.map((_, i) => i * step + histgram.row.min)
  }), [bins, histgram.row.min, step]);

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
              return (`r ${ctx.dataIndex * step + histgram.row.min}`)
            },
          }
        },
      }
    }), [bins, histgram.row.max, histgram.row.min, step]);

  return <Box w="full" h="full"><Chart type={"bar"} options={options} data={data} /></Box>;
};

export default HistgramChart;
