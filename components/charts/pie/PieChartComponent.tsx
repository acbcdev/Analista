"use client";

import { Pie, PieChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartProps {
	title: string;
	description: string;
	data: any[];
	config: ChartConfig;
	dataKey: string;
	nameKey: string;
}

export function PieChartComponent({
	title,
	description,
	data,
	config,
	dataKey,
	nameKey,
}: PieChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Pie
							data={data}
							dataKey={dataKey}
							nameKey={nameKey}
							innerRadius={50}
							outerRadius={80}
							paddingAngle={5}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
