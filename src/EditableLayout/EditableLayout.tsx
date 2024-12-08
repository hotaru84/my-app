import { FC, ReactNode } from "react";
import ReactGridLayout, { Layout } from "react-grid-layout";

import './react-grid-layout.css'
import { useMeasure } from "react-use";
import { Box } from "@chakra-ui/react";

export interface EditableLayoutProps {
	children: ReactNode;
	isEditable?: boolean;
	numOfRows?: number;
	layout?: Layout[];
	onLayoutChange?: (l: Layout[] | undefined) => void;
	isFree?: boolean;
}

const EditableLayout: FC<EditableLayoutProps> = ({
	children,
	isEditable = false,
	numOfRows = 6,
	layout,
	onLayoutChange,
	isFree = false
}) => {

	const [ref, { width }] = useMeasure<HTMLDivElement>();

	return <Box w="full" h="full" ref={ref}>
		<ReactGridLayout
			className="layout"
			containerPadding={[16, 0]}
			margin={[16, 16]}
			isDraggable={isEditable}
			isResizable={isEditable}
			layout={layout}
			onLayoutChange={onLayoutChange}
			width={width}
			rowHeight={38}
			compactType={isFree ? null : 'vertical'}
			allowOverlap={isFree}
			draggableHandle=".dg-handle"
		>
			{children}
		</ReactGridLayout>
	</Box>;
};

export default EditableLayout;