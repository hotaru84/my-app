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
import { TbPackage } from "react-icons/tb";
import { validSampleData } from "./filterSampleData";
import { SampleData, SampleDataInfo } from "./SampleData";

interface Props {
  info: SampleDataInfo;
  data: SampleData[];
}

const CounterCard: FC<Props> = ({
  info,
  data
}) => {
  const emphasize = false;
  const score = data.filter(d => validSampleData(info.filter, d)).length;

  return (
    <HStack align="center" spacing={4} w="full" h="full" p={4}>
      <Avatar
        rounded={16}
        boxSize={16}
        icon={<Icon as={TbPackage} w={10} h={10} color="white" />}
        bgColor={'blue.300'}
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
            {score}{" "}
            <chakra.span fontSize="sm" color="gray.400" fontWeight="normal">
              {info.unit}
            </chakra.span>
          </Heading>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default CounterCard;
