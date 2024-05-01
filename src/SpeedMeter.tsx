import { FC } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { useInterval, useList } from "react-use";

export const SpeedMeter: FC = () => {
  const [fps, { set }] = useList([12, 123, 63, 256, 75, 431, 4, 6, 23]);

  useInterval(() => {
    set([...fps.slice(1), Math.floor(Math.random() * 255)]);
  }, 500);

  return (
    <Sparklines data={fps} limit={10} min={0} max={255} height={20}>
      <SparklinesLine style={{ fill: "#0BC5EA", stroke: "#0BC5EA" }} />
      <SparklinesSpots size={4} />
    </Sparklines>
  );
};
