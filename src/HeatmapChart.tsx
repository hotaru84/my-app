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

import { AspectRatio, ResponsiveValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
);

interface BarLineTimeChartProps {
  ratio?: ResponsiveValue<number>;
}

const HeatmapChart: FC<BarLineTimeChartProps> = ({ ratio }) => {
  const image = new Image();
  image.src = './sample.svg';

  const data: ChartData<"bubble"> = useMemo(() => ({
    datasets: [
      {
        type: "bubble",
        data: [...Array(1024)].map((_, i) => ({
          x: Math.random() * 128,
          y: Math.random() * 128,
          r: Math.random() * 20
        })),
        borderWidth: 0,
        pointStyle: 'rectRounded',
        backgroundColor: (ctx) => {
          const i = ctx.dataIndex;
          const p = ctx.dataset?.data[i] as BubbleDataPoint;

          return `rgba(0,200,24,${p.r ? p.r / 40 : 0})`;
        },
        datalabels: {
          display: false,
        }
      },
    ] as ChartDataset<"bubble">[],
  }), []);

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
        console.log(chart.scales)

        ctx.drawImage(image, top + 14, left - 14, width, height);
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
        }
      }
    }), []);

  return <motion.div layout>
    <AspectRatio ratio={image.width / image.height}>
      <Chart type={"bubble"} options={options} data={data} plugins={[bgImage]} />
    </AspectRatio>
  </motion.div >;
};

export default HeatmapChart;
