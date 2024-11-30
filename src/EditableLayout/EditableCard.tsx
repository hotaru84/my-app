import { Card } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC, ReactNode, useMemo } from "react";

interface EditableCardProps {
	isEditable: boolean;
	children: ReactNode;
}

const EditableCard: FC<EditableCardProps> = ({ isEditable, children }) => {
	const cardStyle = useMemo(() => {
		if (isEditable) return {
			boxShadow: 'lg',
			rounded: 4,
			cursor: 'grab'
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
	</Card>;
};

export default EditableCard;
