import { Box, Center, Image } from "@chakra-ui/react"
import {  motion } from "framer-motion"
import { FC, useCallback,  } from "react"

export const DeviceSvg:FC = ()=>{
  const w = 30;
  const ratio = 4/3;
  const isLandscape = false;
  const rotate = 90;

  return (
    <Center w={`${isLandscape?w:w/ratio}vw`} h={`${isLandscape?w/ratio:w}vw`} cursor={"pointer"} justifySelf={"center"}>
      <Image 
        src='http://localhost:3000/images/sample.svg' 
        fit="contain"
        w={`${w}vw`}
        transform={`rotate(${rotate}deg) scale(${rotate > 0 ? ratio:1}) `}
        transformOrigin={"center"}
        />
    </Center>
  )
}