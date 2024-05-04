import { FC } from "react";
import { Card, CardBody, CardHeader, Flex } from "@chakra-ui/react";

const Dashboad: FC = () => {
  return (
    <Flex w="full" h="100vh" overflowY={"auto"}>
      <Card m={2}>
        <CardHeader>dashboard</CardHeader>
        <CardBody />
      </Card>
    </Flex>
  );
};

export default Dashboad;
