import { VStack, Box } from "@chakra-ui/react";
import { FC, ReactElement } from "react";
import ReactGridLayout from "react-grid-layout";

import { useMeasure } from "react-use";

interface ListDetailTemplateProps {
  header?: ReactElement;
  list?: ReactElement;
  detail?: ReactElement;
}

const ListDetailTemplate: FC<ListDetailTemplateProps> = ({
  header,
  list,
  detail,
}) => {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  return (
    <VStack w="full" h="full" gap={0}>
      {header}
      <Box w="full" h="full" ref={ref}>
        <ReactGridLayout
          className="layout"
          compactType={'vertical'}
          resizeHandles={['e']}
          width={width / 10}
          rowHeight={height}
          isBounded={true}
          preventCollision
        >
          <Box key='list-panel' data-grid={{ x: 0, y: 0, w: 3, h: 1 }}>
            {list}
          </Box>
        </ReactGridLayout>
        {detail}
      </Box>
    </VStack>
  );
};
export default ListDetailTemplate;
