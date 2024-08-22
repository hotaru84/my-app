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
import { Box, Button, IconButton } from "@chakra-ui/react";
import { TbZoomInArea } from "react-icons/tb";

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

const BarLineTimeChart: FC = () => {
  const [linePoints,setLinePoints] = useState<Point[]>([]);
  const [barPoints,setBarPoints] = useState<Point[]>([]);
  const [selectTime,setSelectTime] = useState(0);
  const isSelected = barPoints.findIndex((p)=>p.x === selectTime) >= 0;

  useInterval(() => {
    const now = new Date();
    setLinePoints([
      ...linePoints.length > 10 ? linePoints.slice(1):barPoints,
      {        
        x: now.getTime(),
        y: Math.floor(Math.random() * 100),
      }
    ]);
    setBarPoints([
      ...barPoints.length > 10 ? barPoints.slice(1):barPoints,
      {        
        x: now.getTime(),
        y: Math.floor(Math.random() * 255),
      }
    ]);
  }, 1000);

  const data:ChartData<any> = useMemo(()=>({
    datasets: [
      {
        type: "line",
        label: "Rate",
        borderColor: "#68D391",
        backgroundColor: "#68D391",
        data: linePoints,
        yAxisID: "y1",
        datalabels: {
          display: false,
        },
      },
      {
        type: "bar",
        label: "Throuput",
        data: barPoints,
        backgroundColor: barPoints.map((p)=>p.x === selectTime?'#ff6384':"#63B3ED"),
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
    ],
  }),[barPoints, linePoints, selectTime]);
  
  const options:ChartOptions<"bar"|"line"> = useMemo(()=>(
  {
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
    onClick:(_event: ChartEvent, el: ActiveElement[], chart: ChartJS)=>{
      if(el.length > 0) {
        const v = chart.data.datasets[el[0].datasetIndex].data[el[0].index] as Point;
        setSelectTime(selectTime === v.x? 0:v.x);  //toggle 
      }
    },
  }),[selectTime]);

  
  return <>
  {isSelected&&<Button leftIcon={<TbZoomInArea/>}  color="#ff6384" variant={"ghost"}>Drill down</Button>}
  <Chart type={"bar"} options={options} data={data} />
  </>;
};

export default BarLineTimeChart;
