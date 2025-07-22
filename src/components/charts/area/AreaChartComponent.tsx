"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface AreaChartProps {
	title: string;
	description: string;
	data: any[];
	config: ChartConfig;
	xAxisKey: string;
	areas: {
		dataKey: string;
		type: "natural" | "linear" | "step";
		fill: string;
		stroke: string;
		stackId: string;
	}[];
}

export function AreaChartComponent({
	title,
	description,
	data,
	config,
	xAxisKey,
	areas,
}: AreaChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<AreaChart
						accessibilityLayer
						data={data}
						margin={{
							left: -20,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={xAxisKey}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickCount={3}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						{areas.map((area) => (
							<Area
								key={area.dataKey}
								dataKey={area.dataKey}
								type={area.type}
								fill={area.fill}
								fillOpacity={0.4}
								stroke={area.stroke}
								stackId={area.stackId}
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
