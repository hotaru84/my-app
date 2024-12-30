import { FC, useCallback, useEffect, useMemo, useRef } from "react";
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
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box } from "@chakra-ui/react";
import { endOfToday, format, startOfToday } from "date-fns";
import { formatDistance, useTimeframe } from "./useTimeframe";
import { generateSampleData } from "./Dashboard/generateSampleData";
import { validSampleData } from "./Dashboard/filterSampleData";
import ZoomPlugin from 'chartjs-plugin-zoom';

import annotationPlugin from 'chartjs-plugin-annotation';
import { useChartZoom } from "./Dashboard/useChartZoom";


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
  const { isZoom, min, max, isInZoomRange, setZoomStart, setZoomEnd, resetZoom } = useChartZoom(true);
  const { timeframe, timescale, timeToPoint, onScaleChange } = useTimeframe();
  const data = useMemo(() => generateSampleData(timeframe, 100), [timeframe]);
  const line = useMemo(() => timeToPoint(
    data.filter(d => validSampleData(d)).map(d => d.time)), [data, timeToPoint]);


  const label = useMemo(() => {
    return formatDistance(min, max, timeframe.unit);
  }, [max, min, timeframe.unit]);

  const onChange = useCallback(() => {

    onScaleChange(new Date(min), new Date(max));
    resetZoom();
  }, [max, min, onScaleChange, resetZoom]);

  useEffect(() => {
    onScaleChange(startOfToday(), endOfToday());
  }, [onScaleChange]);

  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'x',
    },
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
        enabled: min === 0,
        yAlign: "center",
      },
      annotation: {
        animations: {
          numbers: {
            duration: 200
          }
        },
        annotations: {
          indicator: {
            init: () => ({ centerX: 0 }),
            type: min > 0 ? "box" : "line",
            xMin: min > 0 ? min : max,
            xMax: max,
            borderDash: [2, 2],
            borderWidth: isZoom ? 1 : 0,
            borderColor: '#FF9F40',
            backgroundColor: isZoom ? '#FF9F4033' : 'transparent',
            label: {
              display: min > 0,
              content: label,
              textAlign: "start",
              color: "gray",
              font: { size: 18, weight: "bold" },
            }
          },
        }
      },
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
      if (evt.native == null || !isZoom) return;
      const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
      if (points.length > 0) {

        if (min === 0) setZoomEnd(line[points[0].index].x);
        else onChange();
      }
    },
    onHover: (evt, el, chart) => {
      if (evt.native == null || !isZoom) return;
      const points = chart.getElementsAtEventForMode(evt.native, 'x', { intersect: false }, true);
      if (points.length > 0) {
        if (min === 0) setZoomStart(line[points[0].index].x);
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
        return dataIndex < line.length && isInZoomRange(line[dataIndex].x) ? '#FF9F40' : '#63B3ED';
      },
      yAxisID: "y",
      borderRadius: 8,
      datalabels: {
        align: "center",
        clamp: true,
        font: { size: 12, weight: "bold" },
      },
    }],
  }), [line, isInZoomRange]);


  return <Box w="full" h="full">
    <Chart type={"bar"} ref={chartRef} options={options} data={chartdata} />
  </Box>
};

export default TrendlineChart;
