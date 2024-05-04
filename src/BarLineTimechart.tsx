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
  ChartOptions,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";

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

export const options: ChartOptions<"bar"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "",
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "second",
      },

      grid: {
        display: false,
      },
    },
    y: {
      type: "linear",
      max: 256,
      position: "right",
      display: false,
      grid: {
        display: false,
      },
    },
    y1: {
      type: "linear",
      max: 100,
      position: "left",
    },
  },
};

export const data: ChartData<any> = {
  datasets: [
    {
      type: "bar",
      label: "Throuput",
      data: [],
      backgroundColor: "rgba(75, 192, 192,0.8)",
      borderWidth: 0,
      borderRadius: 4,
      yAxisID: "y",
      datalabels: {
        align: "start",
        anchor: "end",
        formatter: (value: Point) => {
          return Math.round(value.y);
        },
        color: "whitesmoke",
        font: { size: 12, weight: "bold" },
      },
    },
    {
      type: "line",
      label: "Rate",
      borderColor: "gray",
      backgroundColor: "gray",
      data: [],
      yAxisID: "y1",
      datalabels: {
        display: false,
      },
    },
  ],
};

const BarLineTimeChart: FC = () => {
  const chartRef = useRef<ChartJS<any>>(null);

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

  return <Chart type={"bar"} ref={chartRef} options={options} data={data} />;
};

export default BarLineTimeChart;
