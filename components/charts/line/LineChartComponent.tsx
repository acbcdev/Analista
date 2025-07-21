"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

interface LineChartProps {
	title: string;
	description: string;
	data: any[];
	config: ChartConfig;
	xAxisKey: string;
	lines: {
		dataKey: string;
		stroke: string;
		type: "natural" | "linear" | "step";
	}[];
}

export function LineChartComponent({
	title,
	description,
	data,
	config,
	xAxisKey,
	lines,
}: LineChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={config}>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{
							left: 12,
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
						{lines.map((line) => (
							<Line
								key={line.dataKey}
								dataKey={line.dataKey}
								type={line.type}
								stroke={line.stroke}
								strokeWidth={2}
								dot={false}
							/>
						))}
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
