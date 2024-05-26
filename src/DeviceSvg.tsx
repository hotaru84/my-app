import { Box, Center, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC, useCallback } from "react";

interface Props {
  w: number;
  aspect: number;
  rotate: number;
}
export const DeviceSvg: FC<Props> = ({ w, aspect, rotate }) => {
  return (
    <Image
      src="http://localhost:3000/images/sample.svg"
      fit="contain"
      w={`${w}vw`}
      aspectRatio={rotate === 0 || rotate === 180 ? aspect : 1 / aspect}
      transformOrigin={"center"}
      rotate={rotate}
    />
  );
};
