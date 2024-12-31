import { Avatar } from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion"
import { FC } from "react";
import { MdClose } from "react-icons/md";
import { TbCheck } from "react-icons/tb";

interface Props {
  isVisible: boolean;
  isChecked: boolean;
  onClick?: () => void;
}

const CheckAvatar: FC<Props> = ({ isVisible, isChecked, onClick }) => {
  return <AnimatePresence>
    {isVisible &&
      <Avatar
        position="absolute"
        top={-3}
        right={-3}
        bgColor={isChecked ? "blue.300" : 'gray.300'}
        rounded="full"
        boxSize={6}
        icon={isChecked ? <MdClose /> : <TbCheck size={12} />}
        as={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={onClick}
      />}
  </AnimatePresence>
}

export default CheckAvatar;