import { BoxProps, Center } from "@chakra-ui/react";
import { FC } from "react";
import { PanelResizeHandle } from "react-resizable-panels";

export const PanelResizeHandler: FC<BoxProps> = (props) => {
  return (
    <PanelResizeHandle style={{ borderColor: 'blue.400', borderWidth: 1 }} />
  );
};
