import {
  FC,
} from "react";
import {
  Button,
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import "rc-time-picker/assets/index.css";
import {
  TbDotsVertical,
  TbReportAnalytics,
} from "react-icons/tb";


export const FilterActions: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  type PickMode = "-1h" | "lastd" | "lastw" | "custom";
  const modes: { value: PickMode; label: string }[] = [
    { value: "-1h", label: "Last Hour" },
    { value: "lastd", label: "Last Day" },
    { value: "lastw", label: "Last Week" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom">
      <PopoverTrigger>
        <IconButton
          icon={<TbDotsVertical />}
          onClick={onOpen}
          aria-label={"edit"}
          isActive={isOpen}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent w={"full"} right={6}>
          <PopoverArrow />
          <PopoverBody>
            {/** 
             * download /zip
             *  dashboard
             *    output data
             *  gallery
             *    download selected images
             * make report pdf
             */}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
