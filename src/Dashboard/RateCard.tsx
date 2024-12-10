import {
  HStack,
  Icon,
  VStack,
  Text,
  Avatar,
  Heading,
  chakra,
} from "@chakra-ui/react";
import { FC } from "react";
import { TbCheck } from "react-icons/tb";
import { validSampleData } from "./filterSampleData";
import { SampleData, SampleDataInfo } from "./SampleData";

interface Props {
  info: SampleDataInfo;
  data: SampleData[];
}

const RateCard: FC<Props> = ({
  info,
  data
}) => {
  const emphasize = false;
  const deno = info.filters && info.filters.length > 0 ? info.filters[0] : undefined;
  const filtered = data.filter(d => validSampleData(d, info.filter)).length;
  const total = data.filter(d => validSampleData(d, deno)).length;

  return (
    <HStack align="center" spacing={4} w="full" h="full" p={4}>
      <Avatar
        rounded={16}
        boxSize={16}
        icon={<Icon as={TbCheck} w={10} h={10} color="white" />}
        bgColor={'green.300'}
      />
      <VStack align="start" maxW="lg" h="full" spacing={0} justify={"center"}>
        <Text fontSize="md" color="gray.400">
          {info.title}
        </Text>
        <VStack spacing={0}>
          <Heading
            fontSize={{ base: "2xl", md: emphasize ? "5xl" : "4xl" }}
            fontWeight={emphasize ? "bold" : "normal"}
          >
            {(filtered / total * 100).toFixed(2)}
            <chakra.span fontSize="sm" color="gray.400" fontWeight="normal">
              {info.unit}
            </chakra.span>
          </Heading>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default RateCard;
