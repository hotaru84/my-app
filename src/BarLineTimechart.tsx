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
  const [successPoints, setSuccessPoints] = useState<Point[]>([]);
  const [errorPoints, setErrorPoints] = useState<Point[]>([]);
  const [barPoints, setBarPoints] = useState<Point[]>([]);

  useInterval(() => {
    if (activeTime > 0) return;
    const now = new Date();
    setSuccessPoints([
      ...successPoints.length > 10 ? successPoints.slice(1) : barPoints,
      {
        x: now.getTime(),
        y: Math.floor(Math.random() * 100),
      }
    ]);
    setErrorPoints([
      ...errorPoints.length > 10 ? errorPoints.slice(1) : errorPoints,
      {
        x: now.getTime(),
        y: Math.floor(Math.random() * 30),
      }
    ]);
    setBarPoints([
      ...barPoints.length > 10 ? barPoints.slice(1) : barPoints,
      {
        x: now.getTime(),
        y: Math.floor(Math.random() * 255),
      }
    ]);
    if (barPoints.findIndex((p) => p.x === activeTime) < 0 && setActiveTime !== undefined) setActiveTime(0);
  }, 1000);

  const data: ChartData<any> = useMemo(() => ({
    datasets: [
      {
        type: "line",
        label: "Throughput",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: successPoints,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
      },
      {
        type: "bar",
        label: "Error",
        backgroundColor: "#ff6384",
        data: errorPoints,
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
        type: "bar",
        label: "Success",
        data: barPoints,
        backgroundColor: "#63B3ED",
        borderColor: barPoints.map((p) => p.x === activeTime ? '#4299e1' : "#63B3ED"),
        borderWidth: barPoints.map((p) => p.x === activeTime ? 4 : 0),
        borderRadius: 8,
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
    ],
  }), [activeTime, barPoints, errorPoints, successPoints]);

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
