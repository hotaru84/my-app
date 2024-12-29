import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Text, VStack } from "@chakra-ui/react";
import { endOfToday, format, startOfToday } from "date-fns";
import { useTimeframe } from "./useTimeframe";
import { generateSampleData } from "./Dashboard/generateSampleData";
import { validSampleData } from "./Dashboard/filterSampleData";
import ZoomPlugin from 'chartjs-plugin-zoom';
import { useSet } from "react-use";
import annotationPlugin from 'chartjs-plugin-annotation';


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
  ZoomPlugin,
  ChartDataLabels,
  annotationPlugin
);

interface Props {
  moving?: boolean;
}

const TrendlineChart: FC<Props> = ({ moving }) => {
  const chartRef = useRef<ChartJS<any>>(null);
  const [zoomStart, setZoomStart] = useState<number>(0);
  const [zoomEnd, setZoomEnd] = useState<number>(0);
  const { timeframe, timescale, timeToPoint, onScaleChange } = useTimeframe();
  const data = useMemo(() => generateSampleData(timeframe, 100), [timeframe]);
  const line = useMemo(() => timeToPoint(
    data.filter(d => validSampleData(d)).map(d => d.time)), [data, timeToPoint]);

  const onChange = useCallback(({ chart }: { chart: ChartJS }) => {
    const { min, max } = chart.scales.x;
    onScaleChange(new Date(min), new Date(max));
  }, [onScaleChange]);
  useEffect(() => {
    onScaleChange(startOfToday(), endOfToday());
  }, [onScaleChange]);

  const options: ChartOptions<"bar"> = {
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
      annotation: {
        animations: {
          init: false,
        },
        annotations: {
          indicator: {
            type: zoomEnd > 0 ? "box" : "line",
            xMin: zoomStart,
            xMax: zoomEnd > 0 ? zoomEnd : zoomStart,
            borderWidth: 1,
            borderColor: '#FF9F40',
            backgroundColor: '#FF9F4033',
          }
        }
      }
    },
    scales: {
      x: {
        type: "time",
        display: false,
        grid: {
          display: false,
        },
        min: timescale.min,
        max: timescale.max,
      },
      y: {
        type: "linear",
        position: "right",
        display: false,
        grid: {
          display: false,
        },
      },
    },
    onClick: (evt, el, chart) => {
      if (evt.native == null) return;
      const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
      if (points.length > 0) {
        setZoomEnd(line[points[0].index].x);
      }
    },
    onHover: (evt, el, chart) => {
      if (evt.native == null) return;
      const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
      if (points.length > 0) {
        if (zoomEnd === 0) setZoomStart(line[points[0].index].x);
        else setZoomEnd(line[points[0].index].x);
      }
    }
  };


  const chartdata: ChartData<"bar", Point[]> = useMemo(() => ({
    datasets: [{
      type: "bar",
      label: "test",
      data: line,
      backgroundColor: ({ dataIndex }) => {
        if (zoomStart > 0 && zoomEnd > 0) {
          const min = Math.min(zoomStart, zoomEnd);
          const max = Math.max(zoomStart, zoomEnd);

          if (min <= line[dataIndex].x && line[dataIndex].x <= max) return '#FF9F40';
        }
        return "#63B3ED";
      },
      yAxisID: "y",
      borderRadius: 8,
      datalabels: {
        align: "center",
        clamp: true,
        font: { size: 12, weight: "bold" },
      },
    }],
  }), [zoomEnd, line, zoomStart]);


  return <Box w="full" h="full">
    <Chart type={"bar"} ref={chartRef} options={options} data={chartdata} />
  </Box>
};

export default TrendlineChart;
