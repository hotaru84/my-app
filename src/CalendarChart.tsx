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
  TooltipItem,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { color } from "chart.js/helpers";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
  TimeScale,
  ChartDataLabels
);
const plugin = {
  id: "customCanvasBackgroundColor",
  afterDatasetsDraw: (chart: ChartJS<any>) => {
    const {
      ctx,
      chartArea: { top, bottom, right, height },
      config: {
        options: {
          layout: { padding },
        },
      },
    } = chart;
    const gradientBg = ctx.createLinearGradient(0, top, 0, height);
    gradientBg.addColorStop(0, color("teal").alpha(1).rgbString());
    gradientBg.addColorStop(1, color("teal").alpha(0.1).rgbString());
    ctx.fillStyle = gradientBg;
    ctx.fillRect(right + padding.right - 20, top + 10, 10, height - 20);
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("max", right + padding.right - 15, top);
    ctx.fillText("min", right + padding.right - 15, bottom);
  },
};

const options: ChartOptions<"matrix"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: true,
      callbacks: {
        title() {
          return "";
        },
        label(item: TooltipItem<"matrix">) {
          const value = item.raw as MatrixDataType;
          return ["d: " + value.d, "v: " + value.v.toFixed(1)];
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
      top: 20,
      right: 50,
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
      v: Math.random() * 100,
    });
    dt = new Date(dt.setDate(dt.getDate() + 1));
  }

  return data;
}

const data: ChartData<any> = {
  datasets: [
    {
      data: generateData(),
      backgroundColor({ raw }: ScriptableContext<"matrix">) {
        const value = raw as MatrixDataType;
        const alpha = 0.1 + (value.v - 10) / 100;

        return color("teal").alpha(alpha).rgbString();
      },
      borderWidth: 0,
      borderRadius: 4,
      hoverBorderWidth: 2,
      hoverBorderColor: "rgb(0,161,255)",
      width: ({ chart }: ScriptableContext<"matrix">) =>
        (chart.chartArea || {}).width / chart.scales.x.ticks.length - 3,
      height: ({ chart }: ScriptableContext<"matrix">) =>
        (chart.chartArea || {}).height / chart.scales.y.ticks.length - 3,
      datalabels: {
        display: false,
        anchor: "center",
        formatter(value: MatrixDataType) {
          return value.v.toFixed(1);
        },
        color: "whitesmoke",
        font: { size: 10 },
      },
    },
  ],
};
const CalendarChart: FC = () => {
  const chartRef = useRef<ChartJS<"matrix", MatrixDataType[]>>(null);

  return (
    <Chart
      type="matrix"
      ref={chartRef}
      options={options}
      data={data}
      plugins={[plugin]}
    />
  );
};

export default CalendarChart;
