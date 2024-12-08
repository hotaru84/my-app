import { Box, Card, Collapse, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC, ReactNode, useMemo } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";

interface EditableCardProps {
	isEditable: boolean;
	children: ReactNode;
}

const EditableCard: FC<EditableCardProps> = ({ isEditable, children }) => {
	const cardStyle = useMemo(() => {
		if (isEditable) return {
			boxShadow: 'lg',
			rounded: 4,
		}
		return {}
	}, [isEditable]);

	return <Card
		rounded={16}
		{...cardStyle}
		w="full"
		h="full"
		overflow={"auto"}
		as={motion.div}
	>
		{children}

		{isEditable && <IconButton
			icon={<MdOutlineDragIndicator />}
			variant="ghost"
			position="absolute"
			top={2}
			left={2}
			className="dg-handle"
			zIndex="popover"
			cursor='grab' aria-label={""} />}
		<Collapse in={isEditable}>
			<Box position={"absolute"} top={0} right={0} bgColor='gray' opacity={0.5} w="full" h="full" />
		</Collapse>
	</Card>;
};

export default EditableCard;
