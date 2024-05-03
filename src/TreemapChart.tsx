import { FC, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {
  TreemapController,
  TreemapDataPoint,
  TreemapElement,
  TreemapScriptableContext,
} from "chartjs-chart-treemap";
import { color } from "chart.js/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TreemapElement,
  TreemapController,
  Tooltip,
  Legend,
  TimeScale
);

export const options: ChartOptions<"treemap"> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {},
};

const data = {
  datasets: [
    {
      label: "My treemap dataset",
      data: [],
      tree: [15, 6, 6, 5, 4, 3, 2, 2],
      borderWidth: 0,
      borderRadius: 6,
      spacing: 2,
      backgroundColor: (ctx: TreemapScriptableContext) => {
        const value = ctx.raw as TreemapDataPoint;
        const alpha = (10 + value?.v) / 16;
        return color("blue").alpha(alpha).darken(0.3).rgbString();
      },
    },
  ],
};

const TreemapChart: FC = () => {
  const chartRef = useRef<ChartJS<"treemap">>(null);

  return (
    <Chart
      id="test"
      type="treemap"
      ref={chartRef}
      options={options}
      data={data}
    />
  );
};

export default TreemapChart;
