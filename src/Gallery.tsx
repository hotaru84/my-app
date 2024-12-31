import { createRef, FC, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import {
  Box,
  Card,
  CardHeader,
  VStack,
  SimpleGrid,
  Image,
  Spacer,
  HStack,
  Avatar,
  useDisclosure,
  IconButton,
  CardFooter,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { addHours, format } from "date-fns";
import { Navigation } from "./Navigation";
import TrendlineChart from "./TrendlineChart";
import useIdParam from "./useIdParam";
import SimpleTable from "./SimpleTable";
import { TbCheck } from "react-icons/tb";
import { MdClose, MdExpand, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import CheckAvatar from "./CheckAvatar";

export type CardInfo = {
  id: number;
  time: Date,
  value: number;
}

type ImageCardProps = {
  info: CardInfo;
}

const ImageCard: FC<ImageCardProps> = ({ info }) => {
  const { id: selectedId, setId } = useIdParam();
  const isSelected = useMemo(() => String(info.id) === selectedId, [info.id, selectedId]);
  const { isOpen: isHover, onOpen: onHoverStart, onClose: onHoverEnd } = useDisclosure();


  return <Card
    rounded={"lg"}
    as={motion.div}
    layout
    borderWidth={isSelected ? 2 : 0}
    borderColor={"blue.300"}
    onMouseEnter={onHoverStart}
    onMouseLeave={onHoverEnd}
    onClick={() => {
      setId(isSelected ? null : String(info.id));
    }}
    cursor='pointer'
  >
    <CheckAvatar isVisible={isHover || isSelected} isChecked={isSelected} />
    <CardHeader>
      {info.id}:{format(info.time, "yyyy/MM/dd HH")}
    </CardHeader>

    <HStack>
      <Image objectFit={'contain'} mx="auto" src="sample.svg" w={isSelected ? '100%' : 'unset'} />
      {selectedId !== null && <SimpleTable info={info} />}
    </HStack>
    <HStack p={2}>
      <Spacer />
      <IconButton aria-label={""} icon={isSelected ? <MdFullscreenExit /> : <MdFullscreen />} />
    </HStack>
  </Card>
}

const Gallery: FC = () => {
  const cardlist: CardInfo[] = [...Array(100)].map((_, i) => {
    const v = Math.round(Math.random() * 20);

    return {
      id: i,
      time: addHours(new Date(), -i),
      value: v
    } as CardInfo;
  });


  const { id } = useIdParam();
  const pageRef = useRef(cardlist.map(() => createRef<HTMLDivElement>()));
  const scrollToView = useCallback((id: number) => {
    pageRef.current[id]?.current?.scrollIntoView({ behavior: "auto", block: "center" });
  }, []);

  useLayoutEffect(() => {
    // useLayoutEffect for correct scrolling
    if (id !== null) scrollToView(Number(id));
  }, [id, scrollToView]);

  return <VStack w="full" gap={0}>
    <Navigation>
      <Box w="50%" h="30px">
        <TrendlineChart />
      </Box>
      <Spacer />
    </Navigation>
    <VStack w="full" sx={{ scrollSnapType: 'y mandatory', }} overflowY={"auto"}>
      <SimpleGrid columns={id === null ? { sm: 2, md: 3, lg: 4, xl: 5 } : 1} gap={4} w="full" h="full" px={4} justifyContent={"space-around"}>
        {cardlist.map((info, i) =>
          <Box key={`card-${i}`} ref={pageRef.current[i]} sx={{ scrollSnapAlign: "center" }}>
            <ImageCard info={info} />
          </Box>
        )}
      </SimpleGrid>
    </VStack>
  </VStack>;
};

export default Gallery;
