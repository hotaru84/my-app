import {
  Box,
  Grid,
  SimpleGrid,
} from "@chakra-ui/react";
import { Device } from "./Device";
import { DragSortableContext } from "./dragSortableContext";
import { useState } from "react";
const Items = [
  { id: "0", title: "first" },
  { id: "1", title: "first" },
  { id: "2", title: "first" },
  { id: "3", title: "first" },
  { id: "4", title: "first" },
  { id: "5", title: "first" },
  { id: "6", title: "first" },
];

export const DeviceTest = () => {
  const [ids, setIds] = useState<string[]>(Items.map((i) => i.id));

  return (
    <Box w="full" h="full">
      <DragSortableContext ids={ids} setIds={setIds}>
        <SimpleGrid columns={3} spacing={4} justifyContent={"space-between"}>
          {ids.map((id) => {
            return (
              <Device key={id} id={id} />
            );
          })}
        </SimpleGrid>
      </DragSortableContext>
    </Box>
  );
};
