import { FC, useRef } from "react";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";
import { getMilliseconds, getSeconds } from "date-fns";
import { background } from "@chakra-ui/react";

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
  TimeSeriesScale
);

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
  scales: {
    x: {
      type: "time" as const,
      time: {
        unit: "second" as const,
      },
    },
    y: {
      type: "linear" as const,
      max: 256,
      position: "left" as const,
    },
    y1: {
      type: "linear" as const,
      max: 100,
      position: "right" as const,
    },
  },
};

export const data = {
  datasets: [
    {
      type: "bar" as const,
      label: "Dataset 1",
      data: [],
      backgroundColor: "rgb(75, 192, 192)",
      borderWidth: 2,
      yAxisID: "y",
    },
    {
      type: "line" as const,
      label: "Dataset 2",
      data: [],
      yAxisID: "y1",
    },
  ],
};

const BarLineTimeChart: FC = () => {
  const chartRef = useRef<ChartJS>(null);

  useInterval(() => {
    chartRef.current?.data.datasets.forEach((dataset) => {
      const now = new Date();
      const max = dataset.type === "line" ? 100 : 255;
      const firstdata = dataset.data[0] as Point;
      if (firstdata !== undefined && now.getTime() - firstdata.x > 10000) {
        dataset.data.shift();
      }
      dataset.data.push({
        x: now.getTime(),
        y: Math.floor(Math.random() * max),
      });
    });
    chartRef.current?.update();
  }, 1000);

  return <Chart type="bar" ref={chartRef} options={options} data={data} />;
};

export default BarLineTimeChart;
