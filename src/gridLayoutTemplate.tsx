import { FC, ReactElement } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import { PanelResizeHandler } from "./PanelResizeHandler";

interface Props {
  vertical?: boolean;
  childrens: ReactElement[];
}

const GridLayoutTemplate: FC<Props> = ({
  vertical,
  childrens
}) => {
  const numOfRows = childrens.length;

  return (
    <PanelGroup direction={vertical ? "vertical" : "horizontal"}>
      {childrens.flatMap((row, j) => ([
        <Panel key={'grid-row-' + j} minSize={10}>
          {row}
        </Panel>,
        j < numOfRows - 1 && <PanelResizeHandler
          w={'0.25rem'} h={'full'}
          key={'grid-row-rh-' + j}
        />
      ]
      ))}
    </PanelGroup>
  );
};
export default GridLayoutTemplate;
