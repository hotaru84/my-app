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
  Plugin,
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

interface BubbleChartProps {
  ratio?: ResponsiveValue<number>;
  data: Histgram2d;
}

const BubbleChart: FC<BubbleChartProps> = ({ ratio, data: hist }) => {
  const image = new Image();
  image.src = './sample.svg';
  const bins = hist.bins;
  const histmax = bins.flat().reduce((a, b) => Math.max(a, b));

  const data: ChartData<"bubble"> = useMemo(() => ({
    datasets: [
      {
        type: "bubble",
        data: bins.flatMap((row, r) => row.map<BubbleDataPoint>((col, c) => ({
          x: c * hist.col.step + hist.col.min,
          y: r * hist.row.step + hist.row.min,
          r: col / histmax * 30
        }))),
        borderWidth: 0,
        pointStyle: 'rectRounded',
        backgroundColor: (ctx) => {
          const i = ctx.dataIndex;
          const p = ctx.dataset?.data[i] as BubbleDataPoint;
          const v = (p.r ? p.r : 0);
          const h = (v) * 200

          return `hsl(185, 100%, 50%,${v}%)`;
        },
        datalabels: {
          display: false,
        }
      },
    ] as ChartDataset<"bubble">[],
  }), [bins, hist.col.min, hist.col.step, hist.row.min, hist.row.step]);

  const bgImage: Plugin = {
    id: 'imageBackground',
    beforeDraw: (chart) => {
      if (image.complete) {
        const ctx = chart.ctx;
        ctx.save();
        const {
          top,
          left,
          width,
          height
        } = chart.chartArea;
        ctx.drawImage(image, left, top, width, height);
        ctx.restore();
      }
    }
  };

  const options: ChartOptions<"bubble"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      backgroundColor: 'rgba(0,0,0,0)',
      scales: {
        x: {
          type: 'linear',
          grid: {
            display: true,
          },
        },
        y: {
          type: "linear",
          grid: {
            display: true,
          },
        },
      },
      onClick: (_event: ChartEvent, el: ActiveElement[], chart: ChartJS) => {
        if (el.length === 0) {
          //resetTimescale();
        }
      },
      plugins: {
        legend: {
          display: false
        },
      }
    }), []);

  return <motion.div layout>
    <AspectRatio ratio={image.width / image.height}>
      <Chart type={"bubble"} options={options} data={data} plugins={[bgImage]} />
    </AspectRatio>
  </motion.div >;
};

export default BubbleChart;
