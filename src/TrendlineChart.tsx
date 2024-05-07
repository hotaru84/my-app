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
  ScriptableContext,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { color } from "chart.js/helpers";

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
  TimeSeriesScale,
  ChartDataLabels
);

export const options: ChartOptions<"bar"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    datalabels: {
      formatter: () => "",
      listeners: {
        click: (context) => {
          console.log(context);
          return true;
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      type: "timeseries",
      display: false,
      time: {
        unit: "second",
      },
      grid: {
        display: false,
      },
    },
    y: {
      type: "linear",
      position: "right",
      max: 255,
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

export const data: ChartData<any> = {
  datasets: [
    {
      type: "bar",
      label: "Throuput",
      data: [],

      hoverBorderWidth: 2,
      hoverBorderColor: "rgb(0,161,255)",
      backgroundColor: ({ raw }: ScriptableContext<"bar">) => {
        const value = raw as Point;
        const alpha = 0.1 + (value?.y - 10) / 255;

        return color("#63B3ED").alpha(alpha).rgbString();
      },
      borderWidth: 0,
      borderRadius: 4,
      yAxisID: "y",
    },
  ],
};

const TrendlineChart: FC = () => {
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

export default TrendlineChart;
