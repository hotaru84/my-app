import React, { FC, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  scales,
  TimeSeriesScale,
  TimeScale,
  Point,
} from "chart.js";
import "chartjs-adapter-moment";
import { Bar, Chart } from "react-chartjs-2";
import { useCounter, useInterval, useList, useQueue } from "react-use";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
      max: 256,
    },
  },
  animation: {
    onComplete: () => {},
  },
};

export const data = {
  datasets: [
    {
      label: "Dataset 2",
      data: [],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const Barchart: FC = () => {
  const chartRef = useRef<ChartJS>(null);

  useInterval(() => {
    chartRef.current?.data.datasets.forEach((dataset) => {
      const now = moment.now();
      const firstdata = dataset.data[0] as Point;
      if (
        firstdata !== undefined &&
        moment(now).diff(moment(firstdata.x)) > 10000
      ) {
        dataset.data.shift();
      }
      dataset.data.push({
        x: now,
        y: Math.floor(Math.random() * 255),
      });
    });
    chartRef.current?.update();
  }, 1000);

  return <Chart type="bar" ref={chartRef} options={options} data={data} />;
};

export default Barchart;
