import { BoxProps, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { PanelResizeHandle } from "react-resizable-panels";

export const PanelResizeHandler: FC<BoxProps> = (props) => {
  const effect = { backgroundColor: "gray", opacity: 0.5 };

  return (
    <PanelResizeHandle hitAreaMargins={{ coarse: 0, fine: 0 }}>
      <Center
        as={motion.div}
        whileHover={effect}
        whileDrag={effect}
        whileTap={effect}
        transition={"linear .2s"}
        {...props}
      ></Center>
    </PanelResizeHandle>
  );
};
