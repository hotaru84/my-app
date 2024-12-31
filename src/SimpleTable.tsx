import { ReactElement } from "react";
import {
  Tbody,
  Table,
  Tr,
  Td,
} from "@chakra-ui/react";

type Props<T extends Object> = {
  info: T;
  converter?: (k: string, value: any) => ReactElement;
}

const SimpleTable = <T extends Object,>({ info, converter }: Props<T>): ReactElement => {

  return <Table>
    <Tbody>
      {Object.entries(info).map(([k, v], i) => (
        <Tr key={`r-${k}+${i}`}>
          <Td>{k}</Td>
          <Td>{converter !== undefined ? converter(k, v) : String(v)}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>;
}

export default SimpleTable;
