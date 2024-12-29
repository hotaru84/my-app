import {
  Card,
  Heading,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { FC } from "react";
import { SampleData, SampleDataInfo } from "./SampleData";
import { NavLink } from "react-router-dom";
import { TbArrowRight } from "react-icons/tb";
import { format } from "date-fns";
import TreemapChart from "../TreemapChart";

interface Props {
  info: SampleDataInfo;
  data: SampleData[];
}

const CounterCard: FC<Props> = ({
  info,
  data
}) => {

  return (
    <Wrap gap={2} p={4} shouldWrapChildren justify={"center"}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card variant={'outline'} boxShadow={'none'} p={2} gap={2} justify={"center"} rounded={8} >
          <HStack>
            <Heading color='red.400' isTruncated>{i}</Heading>
            <Spacer />
            <IconButton aria-label={""} as={NavLink} to="#" icon={<TbArrowRight />} bgColor='Background' rounded={16} />
          </HStack>
          <Image src='https://via.placeholder.com/150' />
          <Tag size={"sm"} colorScheme="bg" textColor={"GrayText"} >{format(new Date(), "PP pp")}</Tag>
        </Card>
      ))}
      <TreemapChart />
    </Wrap>
  );
};

export default CounterCard;
