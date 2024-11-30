import { FC, ReactElement } from "react";

import './react-grid-layout.css'
import { Box, Button, ButtonGroup, ScaleFade, useDisclosure } from "@chakra-ui/react";
import EditableLayout from "./EditableLayout";
import EditableCard from "./EditableCard";
import { MdClose } from "react-icons/md";
import { TbCheck, TbEdit } from "react-icons/tb";
import { useEditableLayoutEditor } from "./useEditableLayoutEditor";

export type EditableCardInfo = {
	key: string;
	body: ReactElement;
	w: number;
	h: number;
}

interface EditableCardListProps {
	listId: string;
	cards: EditableCardInfo[];
}

const EditableCardList: FC<EditableCardListProps> = ({ listId, cards }) => {
	const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
	const {
		layout,
		onLayoutChange,
		onUndo,
		onRedo,
		onInitialize,
		isUndoDisable,
		isRedoDisable,
		isInitialized
	} = useEditableLayoutEditor(
		listId,
		cards.map((c, i) => ({ i: c.key, w: c.w, h: c.h, x: i, y: 0 }))
	);

	return <><EditableLayout
		isEditable={isOpen}
		layout={layout}
		numOfRows={12}
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
			position={'absolute'}
			bottom={4}
			left={4}
			rounded={'md'}
			size="lg"
			boxShadow={'lg'}
			colorScheme="cyan"
			isAttached
		>
			<ScaleFade in={isOpen} unmountOnExit><>
				<Button onClick={onInitialize} isDisabled={isInitialized}>Init</Button>
				<Button onClick={onRedo} isDisabled={isRedoDisable}>Redo</Button>
				<Button onClick={onUndo} isDisabled={isUndoDisable}>Undo</Button>
			</>
			</ScaleFade>
			<Button
				onClick={onToggle}
				leftIcon={isOpen ? <MdClose /> : <TbEdit />}
			>
				{isOpen ? "Cancel" : "Edit"}
			</Button>
		</ButtonGroup>
	</>;
}

export default EditableCardList;