import { FC, ReactElement, useMemo } from "react";

import './react-grid-layout.css'
import { Box, Button, ButtonGroup, IconButton, ScaleFade, useDisclosure } from "@chakra-ui/react";
import EditableLayout from "./EditableLayout";
import EditableCard from "./EditableCard";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useLocalStorage } from "react-use";
import { Layout } from "react-grid-layout";
import { MdClose, MdUndo } from "react-icons/md";

export type EditableCardInfo = {
	key: string;
	body: ReactElement;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
}

interface EditableCardListProps {
	lsId: string;
	cards: EditableCardInfo[];
}

const EditableCardList: FC<EditableCardListProps> = ({ lsId, cards }) => {
	const initLayout = useMemo(() => cards.map((c, i) => ({
		i: c.key,
		w: c.w,
		minW: c.minW,
		h: c.h,
		minH: c.minH,
		x: i * c.w,
		y: 0
	})), [cards]);
	const { isOpen, onToggle } = useDisclosure();
	const [layout, onLayoutChange] = useLocalStorage<Layout[]>(lsId, initLayout);

	return <>
		<EditableLayout
			isEditable={isOpen}
			layout={layout}
			numOfRows={18}
			onLayoutChange={onLayoutChange}>
			{cards.map((c) =>
				<Box key={c.key}>
					<EditableCard isEditable={isOpen}>
						{c.body}
					</EditableCard>
				</Box>
			)}
		</EditableLayout>
		<ButtonGroup
			position={"absolute"} bottom={4} left={4}
			colorScheme="cyan"
			boxShadow={"lg"}
			rounded={"md"}
			bgColor={'Background'}
			variant={'ghost'}
			isAttached
		>
			<IconButton
				onClick={onToggle}
				icon={isOpen ? <MdClose /> : <TbEdit />} aria-label={""} />

			<ScaleFade in={isOpen} unmountOnExit>
				<Button
					onClick={() => onLayoutChange(initLayout)}
					leftIcon={<MdUndo />}
				>
					Reset
				</Button>
			</ScaleFade>
		</ButtonGroup>
	</>;
}

export default EditableCardList;