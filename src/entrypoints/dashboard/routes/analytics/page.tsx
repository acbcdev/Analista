import { AreaChartComponent } from "@/components/charts/area/AreaChartComponent";
import { BarChartComponent } from "@/components/charts/bar/BarChartComponent";
import { LineChartComponent } from "@/components/charts/line/LineChartComponent";
import { PieChartComponent } from "@/components/charts/pie/PieChartComponent";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useModelsStore } from "@/store/models";

const chartData = [
	{
		month: "January",
		series1: 186,
		series2: 80,
		series3: 150,
		series4: 100,
		series5: 50,
	},
	{
		month: "February",
		series1: 305,
		series2: 200,
		series3: 250,
		series4: 120,
		series5: 70,
	},
	{
		month: "March",
		series1: 237,
		series2: 120,
		series3: 180,
		series4: 190,
		series5: 90,
	},
	{
		month: "April",
		series1: 73,
		series2: 190,
		series3: 120,
		series4: 150,
		series5: 110,
	},
	{
		month: "May",
		series1: 209,
		series2: 130,
		series3: 210,
		series4: 80,
		series5: 130,
	},
	{
		month: "June",
		series1: 214,
		series2: 140,
		series3: 160,
		series4: 110,
		series5: 150,
	},
];

const chartConfig = {
	series1: { label: "Series 1", color: "var(--chart-1)" },
	series2: { label: "Series 2", color: "var(--chart-2)" },
	series3: { label: "Series 3", color: "var(--chart-3)" },
	series4: { label: "Series 4", color: "var(--chart-4)" },
	series5: { label: "Series 5", color: "var(--chart-5)" },
};

export function Analytics() {
	const models = useModelsStore((state) => state.models);
	return (
		<>
			<div className="flex items-center justify-between p-4">
				<h1 className="text-2xl font-bold">Analytics</h1>
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a model" />
					</SelectTrigger>
					<SelectContent>
						{models.map((model) => (
							<SelectItem key={model.id} value={model.id}>
								{model.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				<AreaChartComponent
					title="Area Chart"
					description="Monthly revenue"
					data={chartData}
					config={chartConfig}
					xAxisKey="month"
					areas={[
						{
							dataKey: "series1",
							type: "natural",
							fill: "var(--color-series1)",
							stroke: "var(--color-series1)",
							stackId: "a",
						},
						{
							dataKey: "series2",
							type: "natural",
							fill: "var(--color-series2)",
							stroke: "var(--color-series2)",
							stackId: "a",
						},
					]}
				/>
				<BarChartComponent
					title="Bar Chart"
					description="Monthly sign-ups"
					data={chartData}
					config={chartConfig}
					xAxisKey="month"
					bars={[
						{
							dataKey: "series3",
							fill: "var(--color-series3)",
							radius: 4,
						},
					]}
				/>
				<LineChartComponent
					title="Line Chart"
					description="Daily active users"
					data={chartData}
					config={chartConfig}
					xAxisKey="month"
					lines={[
						{
							dataKey: "series4",
							stroke: "var(--color-series4)",
							type: "natural",
						},
					]}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
				<PieChartComponent
					title="Pie Chart"
					description="User demographics"
					data={chartData}
					config={chartConfig}
					dataKey="series5"
					nameKey="month"
				/>
			</div>
		</>
	);
}
