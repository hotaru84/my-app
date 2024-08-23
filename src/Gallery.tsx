import { FC, useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Icon,
  Skeleton,
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tag,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { TbPackage } from "react-icons/tb";
import { motion, Variants } from "framer-motion";

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


const Gallery: FC = () => {
  const { selected, select } = useIdSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const footerVariants: Variants = {
    hover: {
      display: 'block'
    }
  };

  return selected.length > 0 ? (
    <DetailViewer />
  ) : (
    <Wrap
      shouldWrapChildren
      w="full"
      m={8}
      justify={"center"}
      justifyContent={"space-between"}
    >
      {[...Array(10)].map((_, i) => (
        <Card
          rounded={"lg"}
          key={`card-${i}`}
          onClick={() => { select(i.toString()) }}
          as={motion.div}
          layout
          whileHover="hover"
        >
          <CardBody>
            <Skeleton w="xs" aspectRatio={2} speed={3} />
          </CardBody>
          <CardFooter as={motion.div} variants={footerVariants} display="none">
            <Button>TEST</Button>
          </CardFooter>
        </Card>
      ))}
    </Wrap>
  );
};

export default Gallery;
