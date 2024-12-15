import { FC, useCallback, useMemo } from "react";

import { Box } from "@chakra-ui/react";
import EditableLayout from "../EditableLayout/EditableLayout";
import EditableCard from "../EditableLayout/EditableCard";
import { Layout } from "react-grid-layout";
import { SampleDataInfoEditor } from "./SampleDataInfoEditor";
import { SampleDataInfo, SampleDataTypes } from "./SampleData";
import CounterCard from "./CounterCard";
import { useList } from "react-use";
import RateCard from "./RateCard";
import TimelineCard from "./TimelineCard";
import { useTimeframe } from "../useTimeframe";
import { generateSampleData } from "./generateSampleData";


interface EditableCardListProps {
	isEditable?: boolean;
}
const defalutCardInfo: SampleDataInfo[] = [
	{
		layout: {
			i: 'count',
			x: 0,
			y: 0,
			w: 4,
			h: 2
		},
		title: "Count",
		unit: "count",
		type: "counter",
		filter: {}
	},
	{
		layout: {
			i: 'ratio',
			x: 4,
			y: 0,
			w: 4,
			h: 2
		},
		title: "Success",
		unit: "%",
		type: "ratio",
		filter: {}
	},

	{
		layout: {
			i: 'elapsed',
			x: 8,
			y: 0,
			w: 4,
			h: 2
		},
		title: "Elapsed",
		unit: "hour",
		type: "elapsed",
		filter: {}
	},
	{
		layout: {
			i: "timeline",
			x: 0,
			y: 2,
			w: 12,
			h: 7
		},
		title: "",
		unit: "",
		type: "timeline",
		filter: {}
	},
	{
		layout: {
			i: "gallery",
			x: 0,
			y: 9,
			w: 6,
			h: 4
		},
		title: "",
		unit: "",
		type: "gallery",
		filter: {}
	},
	{
		layout: {
			i: "datatable",
			x: 6,
			y: 9,
			w: 6,
			h: 4
		},
		title: "",
		unit: "",
		type: "table",
		filter: {}
	}
];

const EditableCardList: FC<EditableCardListProps> = ({ isEditable = false }) => {
	const { timeframe } = useTimeframe();
	const data = useMemo(() => generateSampleData(timeframe, 10000), [timeframe]);
	//const timeline = useTimelineStats({ start: startOfToday(), end: addDays(startOfToday(), 7), slot: 7 });
	const [cardinfo, { set: setInfo, updateAt: updateInfoAt, }] = useList<SampleDataInfo>(defalutCardInfo);
	const layout = useMemo(() => cardinfo.map(c => c.layout), [cardinfo]);

	const onLayoutChange = useCallback((layouts: Layout[] | undefined) => {
		if (layouts !== undefined) {
			setInfo(cardinfo.map((info): SampleDataInfo => {
				const candidate = layouts.find(l => l.i === info.layout.i) ?? info.layout;
				return {
					...info,
					layout: candidate,
				}
			}).sort((a, b) => a.layout.i.localeCompare(b.layout.i)));
		}
	}, [cardinfo, setInfo]);

	const onInfoChange = useCallback((info: SampleDataInfo) => {
		const idx = cardinfo.findIndex(c => c.layout.i === info.layout.i);
		if (idx >= 0) updateInfoAt(idx, info);
	}, [cardinfo, updateInfoAt]);

	/*
case 'timeline':
	return <VStack w="full" h="full" p={4} gap={0} align={"start"}>
		<ButtonGroup colorScheme="orange" variant={'ghost'}>
			<TimeRangeTag
				min={timeline.scale.start}
				max={timeline.scale.end}
				isZoom={timeline.isZoomed}
				onClick={timeline.resetScale}
			/>
		</ButtonGroup>
		<BarLineTimeChart timeline={timeline} />
	</VStack>;
case 'gallery':
	return <SimpleGrid w="full" p={4} columns={3} gap={2}>{[1, 2, 3].map((i) => (
		<Card variant={"outline"} key={'dqel' + i} boxShadow={0} w="full">
			<Skeleton aspectRatio={2} speed={3} w="full" />
			<IconButton aria-label="link" variant={"ghost"} icon={<TbArrowRight />} as={NavLink} to="../gallery" />
		</Card>))}</SimpleGrid>;
case 'table':
	return <Datacard />;*/

	return <EditableLayout
		isEditable={isEditable}
		layout={layout}
		numOfRows={18}
		onLayoutChange={onLayoutChange}>
		{cardinfo.map((info) => <Box key={info.layout.i}>
			{isEditable && <Box position={"absolute"} top={2} right={2} zIndex="popover"><SampleDataInfoEditor info={info} onInfoChange={onInfoChange} /></Box>}
			<EditableCard isEditable={isEditable}>
				{info.type === SampleDataTypes.counter && <CounterCard info={info} data={data} />}
				{info.type === SampleDataTypes.ratio && <RateCard info={info} data={data} />}
				{info.type === SampleDataTypes.timeline && <TimelineCard info={info} data={data} />}
			</EditableCard>
		</Box>
		)}
	</EditableLayout>
}

export default EditableCardList;