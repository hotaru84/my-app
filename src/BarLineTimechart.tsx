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
} from "chart.js";
import "chartjs-adapter-moment";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
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
      text: "Chart.js Bar Chart",
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

const BarLineTimechart: FC = () => {
  const chartRef = useRef<ChartJS>(null);

  useInterval(() => {
    chartRef.current?.data.datasets.forEach((dataset) => {
      const now = moment.now();
      const max = dataset.type === "line" ? 100 : 255;
      const firstdata = dataset.data[0] as Point;
      if (
        firstdata !== undefined &&
        moment(now).diff(moment(firstdata.x)) > 10000
      ) {
        dataset.data.shift();
      }
      dataset.data.push({
        x: now,
        y: Math.floor(Math.random() * max),
      });
    });
    chartRef.current?.update();
  }, 1000);

  return <Chart type="bar" ref={chartRef} options={options} data={data} />;
};

export default BarLineTimechart;
