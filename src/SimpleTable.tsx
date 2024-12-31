import { ReactElement } from "react";
import {
  Tbody,
  Table,
  Tr,
  Td,
} from "@chakra-ui/react";

type Props<T extends Object> = {
  info: T;
}

const SimpleTable = <T extends Object,>({ info }: Props<T>): ReactElement => {

  return <Table>
    <Tbody>
      {Object.keys(info).map((k, i) => (
        <Tr key={`r-${k}+${i}`}>
          <Td>{k}</Td>
          <Td>{String(info[k as keyof T])}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>;
}

export default SimpleTable;
