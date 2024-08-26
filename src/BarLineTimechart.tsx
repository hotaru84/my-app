import { FC, useMemo, useState } from "react";
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
  ChartEvent,
  ActiveElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { useInterval } from "react-use";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AspectRatio, ResponsiveValue } from "@chakra-ui/react";

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

interface BarLineTimeChartProps {
  activeTime?: number;
  setActiveTime?: (time: number) => void;
  ratio?: ResponsiveValue<number>;
}

const BarLineTimeChart: FC<BarLineTimeChartProps> = ({ activeTime = 0, setActiveTime, ratio }) => {
  const [ratePoints, setRatePoints] = useState<Point[]>([]);
  const [errorPoints, setErrorPoints] = useState<Point[]>([]);
  const [totalPoints, setTotalPoints] = useState<Point[]>([]);

  useInterval(() => {
    if (activeTime > 0) return;
    const total = Math.floor(Math.random() * 250 + 30);
    const err = Math.floor(Math.random() * 30);
    const now = new Date();
    setErrorPoints([
      ...errorPoints.length > 10 ? errorPoints.slice(1) : errorPoints,
      {
        x: now.getTime(),
        y: err,
      }
    ]);
    setTotalPoints([
      ...totalPoints.length > 10 ? totalPoints.slice(1) : totalPoints,
      {
        x: now.getTime(),
        y: total
      }
    ]);
    setRatePoints([
      ...ratePoints.length > 10 ? ratePoints.slice(1) : ratePoints,
      {
        x: now.getTime(),
        y: Math.floor((total - err) / total * 100),
      }
    ]);
    if (totalPoints.findIndex((p) => p.x === activeTime) < 0 && setActiveTime !== undefined) setActiveTime(0);
  }, 1000);

  const data: ChartData<any> = useMemo(() => ({
    datasets: [
      {
        type: "line",
        label: "Rate(%)",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: ratePoints,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
      },
      {
        type: "bar",
        label: "Total count",
        data: totalPoints,
        backgroundColor: totalPoints.map((p) => p.x === activeTime ? '#FF9F40' : "#63B3ED"),
        borderRadius: 8,
        yAxisID: "y",
        order: 2,
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
        label: "Error count",
        backgroundColor: "#ff6384",
        data: errorPoints,
        yAxisID: "y",
        datalabels: {
          display: false,
          align: "end",
          anchor: "end",
          formatter: (value: Point) => {
            return Math.round(value.y);
          },
          color: "#ff6384",
          font: { size: 12, weight: "bold" },
          order: 3
        },
      },
    ],
  }), [activeTime, totalPoints, errorPoints, ratePoints]);

  const options: ChartOptions<"bar" | "line"> = useMemo(() => (
    {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true
          }
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
          stacked: true
        },
        y: {
          type: "linear",
          position: "right",
          display: false,
          grid: {
            display: false,
          },
          stacked: true,
        },
        y1: {
          type: "linear",
          max: 100,
          position: "left",
        },
      },
      onClick: (_event: ChartEvent, el: ActiveElement[], chart: ChartJS) => {
        if (el.length > 0 && setActiveTime !== undefined) {
          const v = chart.data.datasets[el[0].datasetIndex].data[el[0].index] as Point;
          setActiveTime(activeTime === v.x ? 0 : v.x);  //toggle 
        } else if (setActiveTime !== undefined) {
          setActiveTime(0);
        }
      },
    }), [activeTime, setActiveTime]);


  return <>
    <AspectRatio ratio={ratio}>
      <Chart type={"bar"} options={options} data={data} />
    </AspectRatio>
  </>;
};

export default BarLineTimeChart;
