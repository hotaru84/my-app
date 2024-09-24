import { FC, useMemo, useRef } from "react";
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
import { theme } from "@chakra-ui/react";
import { addHours } from "date-fns";

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
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    datalabels: {
      formatter: () => "",
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
      hoverBorderWidth: 0,
      hoverBackgroundColor: theme.colors.orange[500],
      backgroundColor: ({ raw }: ScriptableContext<"bar">) => {
        const value = raw as Point;
        const alpha = 0.1 + (value?.y - 10) / 255;

        return color(theme.colors.green[300]).alpha(alpha).rgbString();
      },
      borderWidth: 0,
      borderRadius: 4,
      yAxisID: "y",
    },
  ],
};

interface Props {
  moving?: boolean;
}

const TrendlineChart: FC<Props> = ({ moving }) => {
  const chartRef = useRef<ChartJS<any>>(null);
  const data = useMemo<ChartData<'bar'>>((): ChartData<any> => {
    return {
      datasets: [
        {
          type: "bar",
          label: "Throuput",
          data: [...Array(30)].map((_, i) => ({ x: addHours(new Date(), i), y: Math.random() * 256 })),
          hoverBorderWidth: 0,
          hoverBackgroundColor: theme.colors.orange[500],
          backgroundColor: ({ raw }: ScriptableContext<"bar">) => {
            const value = raw as Point;
            const alpha = 0.1 + (value?.y - 10) / 255;

            return color(theme.colors.green[300]).alpha(alpha).rgbString();
          },
          borderWidth: 0,
          borderRadius: 4,
          yAxisID: "y",
        },
      ],
    }
  }, []);


  return <Chart type={"bar"} ref={chartRef} options={options} data={data} />;
};

export default TrendlineChart;
