import { FC, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
  LineElement,
  PointElement,
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  MatrixController,
  MatrixElement,
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
  },
  scales: {
    y: {
      type: "time" as const,
      left: "left" as const,
      time: {
        unit: "day" as const,
        parser: "i",
        isoWeekday: 1,
        displayFormats: {
          day: "iiiiii",
        },
      },
    },
    x: {
      type: "time" as const,
      position: "top" as const,
      time: {
        unit: "day" as const,
      },
    },
  },
};

const CalendarChart: FC = () => {
  const chartRef = useRef(null);
  const data = {
    datasets: [
      {
        data: [],
        borderWidth: 1,
        hoverBackgroundColor: "yellow",
        hoverBorderColor: "yellowgreen",
      },
    ],
  };

  return <Chart type="matrix" ref={chartRef} options={options} data={data} />;
};

export default CalendarChart;
