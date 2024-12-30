import { createRef, FC, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  VStack,
  SimpleGrid,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { addHours, format } from "date-fns";
import { Navigation } from "./Navigation";
import TrendlineChart from "./TrendlineChart";
import useIdParam from "./useIdParam";

type CardInfo = {
  id: number;
  time: Date,
  value: number;
}
type CardLists = {
  label: Date;
  infos: CardInfo[];
}

type ImageCardProps = {
  info: CardInfo;
}

const ImageCard: FC<ImageCardProps> = ({ info }) => {
  const { id: selectedId, setId } = useIdParam();
  const isSelected = useMemo(() => String(info.id) === selectedId, [info.id, selectedId]);

  return <Card
    rounded={"lg"}
    onClick={() => {
      setId(isSelected ? null : String(info.id));
    }}
    as={motion.div}
    layout
    whileHover={{ filter: "brightness(0.9)" }}
    borderWidth={isSelected ? 2 : 0}
    borderColor={"blue.300"}
  >
    <CardHeader>{info.id}:{format(info.time, "yyyy/MM/dd HH")}</CardHeader>
    <CardBody>
      <Image objectFit={'contain'} mx="auto" src="sample.svg" />
    </CardBody>
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
    console.log(id);
    pageRef.current[id]?.current?.scrollIntoView({ behavior: "auto", block: "center" });
  }, []);

  useEffect(() => {
    if (id !== null) scrollToView(Number(id));
  }, [id, scrollToView]);

  return <VStack w="full" gap={0}>
    <Navigation>
      <Box w="50%" h="30px">
        <TrendlineChart />
      </Box>
      <Spacer />
    </Navigation>
    <VStack w="full" sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
      <SimpleGrid columns={id === null ? { sm: 2, md: 3, lg: 4, xl: 5 } : 1} gap={4} w="full" h="full" px={4} justifyContent={"space-around"}>
        {cardlist.map((info, i) =>
          <Box key={`card-${i}`} ref={pageRef.current[i]}>
            <ImageCard info={info} />
          </Box>
        )}
      </SimpleGrid>
    </VStack>
  </VStack>;
};

export default Gallery;
