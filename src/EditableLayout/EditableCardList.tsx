import { FC, ReactElement, useMemo } from "react";

import './react-grid-layout.css'
import { Box } from "@chakra-ui/react";
import EditableLayout from "./EditableLayout";
import EditableCard from "./EditableCard";
import { useLocalStorage } from "react-use";
import { Layout } from "react-grid-layout";

export type EditableCardInfo = {
	body: ReactElement;
	layout: Layout;
}

interface EditableCardListProps {
	lsId: string;
	cards: EditableCardInfo[];
	isEditable?: boolean;
}

const EditableCardList: FC<EditableCardListProps> = ({ lsId, cards, isEditable = false }) => {
	const initLayout = useMemo(() => cards.map(c => c.layout), [cards]);
	const [layout, onLayoutChange] = useLocalStorage<Layout[]>(lsId, initLayout);
	return <EditableLayout
		isEditable={isEditable}
		layout={layout}
		numOfRows={18}
		onLayoutChange={onLayoutChange}>
		{cards.map((c) =>
			<Box key={c.layout.i}>
				<EditableCard isEditable={isEditable}>
					{c.body}
				</EditableCard>
			</Box>
		)}
	</EditableLayout>
}

export default EditableCardList;