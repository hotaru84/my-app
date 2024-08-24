import { FC, useCallback, useMemo, useState } from "react";
import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Skeleton,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tag,
  VStack,
  Wrap,
  SimpleGrid,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { TbPackage } from "react-icons/tb";
import { motion } from "framer-motion";
import { addHours, differenceInHours, format, startOfHour } from "date-fns";
import { Navigation } from "./Navigation";

interface IdSearchReturn {
  isSelected: (id: string) => boolean;
  selected: string[];
  select: (id: string) => void;
  deselect: (id: string) => void;
  toggle: (id: string) => void;
  deselectAll: () => void;
}

function useIdSearchParams(multi: boolean = true): IdSearchReturn {
  const [params, setParams] = useSearchParams();
  const selected = params.getAll("id");
  const isSelected = (id: string) => selected.includes(id);
  const deselectAll = () => {
    setParams(
      (p) => {
        p.delete("id");
        return p;
      },
      { replace: true }
    );
  };
  const select = (id: string) => {
    if (!multi) deselectAll();
    if (!isSelected) {
      setParams(
        (p) => {
          p.append("id", id);
          return params;
        },
        { replace: true }
      );
    }
  };
  const deselect = (id: string) => {
    if (isSelected(id)) {
      params.delete("id");
      if (multi)
        selected.forEach((i) => {
          if (i !== id) params.append("id", i);
        });
      setParams(params, { replace: true });
    }
  };
  const toggle = (id: string) => {
    isSelected(id) ? deselect(id) : select(id);
  };

  return {
    isSelected,
    selected,
    select,
    deselect,
    toggle,
    deselectAll,
  };
}


const PosSlider: FC = () => {
  const success = useMemo(() => [...Array(10)].map(() => Math.round(Math.random() * 60 + 30)), []);
  const error = useMemo(() => [...Array(10)].map(() => Math.round(Math.random() * 60 + 20)), []);
  const min = Math.min(...success, ...error);
  const [pos, setPos] = useState(min);
  const onChange = useCallback((e: number) => {
    const t = [...success, ...error].reduce((a, b) => (Math.abs(a - e) < Math.abs(b - e)) ? a : b);
    setPos(t);
  }, [error, success]);

  return <Slider
    min={0}
    max={100}
    value={pos}
    colorScheme="orange"
    onChange={onChange}
    mb={8}
  >
    <SliderTrack>
    </SliderTrack>
    {success.map((v, i) =>
      <SliderMark value={v} mt={-1.5} key={"success-" + String(i)}>
        <Box boxSize={3} bgColor={"green.300"} rounded={"full"} />
      </SliderMark>
    )}
    {error.map((v, i) =>
      <SliderMark value={v} mt={-1.5} key={"error-" + String(i)}>
        <Box boxSize={3} bgColor={"gray.300"} rounded={"full"} />
      </SliderMark>
    )}
    <SliderMark value={pos} mt={4} ml={-8} >
      <Tag colorScheme="orange" w={16}> {pos}mm</Tag>
    </SliderMark>
    <SliderThumb boxSize={6} bgColor={'orange.100'}>
      <Icon as={TbPackage} color={'orange.300'} />
    </SliderThumb>
  </Slider>
}

const DetailViewer: FC = () => {
  return <PosSlider />;
}

type CardInfo = {
  id: number;
  time: Date,
  value: number;
}
type CardLists = {
  label: Date;
  infos: CardInfo[];
}
const Gallery: FC = () => {
  const { selected, select } = useIdSearchParams();
  const cardlist: CardLists[] = [...Array(100)].map((_, i) => {
    const v = Math.round(Math.random() * 20);

    return {
      id: i,
      time: addHours(new Date(), -v),
      value: v
    } as CardInfo;
  }).reduce((res: CardLists[], info: CardInfo) => {
    const f = startOfHour(info.time);
    const idx = res.findIndex((v) => differenceInHours(v.label, f) === 0);
    if (idx < 0) {
      res.push({
        label: f,
        infos: [info]
      });
    } else {
      res[idx].infos.push(info);
    }
    return res;
  }, [] as CardLists[]).sort((a, b) => differenceInHours(b.label, a.label));

  return selected.length > 0 ? (
    <DetailViewer />
  ) :

    <VStack w="full" gap={0}>
      <Navigation />
      <VStack w="full" sx={{ scrollSnapType: 'y mandatory' }} overflowY={"auto"}>
        {cardlist.map((list, j) => (
          <VStack key={"list" + j} my={4} sx={{ scrollSnapAlign: "start", scrollMargin: 2 }} w="full">
            <Text>{format(list.label, "yyyy/MM/dd hh:00")}</Text>
            <SimpleGrid columns={{ sm: 2, md: 3, lg: 4, xl: 5 }} gap={4} w="full" px={4} justifyContent={"space-around"}>
              {list.infos.map((info, i) =>
                <Card
                  rounded={"lg"}
                  key={`card-${i}`}
                  onClick={() => { select(i.toString()) }}
                  sx={{ scrollSnapAlign: "start", scrollMargin: 2 }}
                  as={motion.div}
                  layout
                  whileHover={{ opacity: 0.5 }}
                >
                  <CardHeader>{format(info.time, "yyyy/MM/dd HH")}</CardHeader>
                  <CardBody>
                    <Skeleton aspectRatio={2} speed={3} />
                  </CardBody>
                </Card>)}
            </SimpleGrid>
          </VStack>))}
      </VStack>
    </VStack>;
};

export default Gallery;
