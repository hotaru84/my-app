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
  ChartOptions,
  ScriptableContext,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { color } from "chart.js/helpers";

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

export const options: ChartOptions<"matrix"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    tooltip: {
      displayColors: false,
      callbacks: {
        title() {
          return "";
        },
        label(context) {
          const v = context.raw as MatrixDataType;
          return ["d: " + v.d, "v: " + v.v.toFixed(2)];
        },
      },
    },
  },
  scales: {
    x: {
      type: "time",
      position: "top",
      offset: true,
      time: {
        unit: "day",
        parser: "i",
        isoWeekday: 1,
        displayFormats: {
          day: "iiiiii",
        },
      },
      reverse: false,
      ticks: {
        source: "data",
        padding: 0,
        maxRotation: 0,
      },
      grid: {
        display: false,
        tickLength: 0,
      },
    },
    y: {
      type: "time",
      position: "left",
      offset: true,
      time: {
        unit: "week",
        round: "week",
        isoWeekday: 1,
        displayFormats: {
          week: "MMM dd",
        },
      },
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        padding: 1,
      },
      grid: {
        display: false,
        tickLength: 0,
      },
      title: {
        display: true,
      },
    },
  },
  layout: {
    padding: {
      top: 10,
    },
  },
};

type MatrixDataType = {
  x: string;
  y: string;
  d: string;
  v: number;
};
function isoDayOfWeek(dt: Date) {
  let wd = dt.getDay(); // 0..6, from sunday
  wd = ((wd + 6) % 7) + 1; // 1..7 from monday
  return "" + wd; // string so it gets parsed
}
function generateData(): MatrixDataType[] {
  const now = new Date();
  const data: MatrixDataType[] = [];
  let dt = startOfMonth(now);
  const end = endOfMonth(dt);
  while (dt <= end) {
    const iso = format(dt, "yyyy-MM-dd");
    data.push({
      x: isoDayOfWeek(dt),
      y: iso,
      d: iso,
      v: Math.random() * 50,
    });
    dt = new Date(dt.setDate(dt.getDate() + 1));
  }

  return data;
}

const data = {
  datasets: [
    {
      data: generateData(),
      backgroundColor({ raw }: ScriptableContext<"matrix">) {
        const value = raw as MatrixDataType;
        const alpha = (10 + value.v) / 60;

        return color("teal").alpha(alpha).rgbString();
      },
      borderColor({ raw }: ScriptableContext<"matrix">) {
        const value = raw as MatrixDataType;
        const alpha = (10 + value.v) / 60;
        return color("teal").alpha(alpha).darken(0.3).rgbString();
      },
      borderWidth: 1,
      hoverBackgroundColor: "yellow",
      hoverBorderColor: "yellowgreen",
      width: ({ chart }: ScriptableContext<"matrix">) =>
        (chart.chartArea || {}).width / chart.scales.x.ticks.length - 3,
      height: ({ chart }: ScriptableContext<"matrix">) =>
        (chart.chartArea || {}).height / chart.scales.y.ticks.length - 3,
    },
  ],
};
const CalendarChart: FC = () => {
  const chartRef = useRef<ChartJS<"matrix", MatrixDataType[]>>(null);

  return (
    <Chart
      id="calendar"
      type="matrix"
      ref={chartRef}
      options={options}
      data={data}
    />
  );
};

export default CalendarChart;
