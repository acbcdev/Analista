import { useMemo } from "react";
import { BarChartComponent } from "@/components/charts/bar/BarChartComponent";
import { LineChartComponent } from "@/components/charts/line/LineChartComponent";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Hours } from "@/types";

interface HoursChartProps {
	data: Hours[];
}

export function HoursChart({ data }: HoursChartProps) {
	// Preparar datos para los gráficos
	const chartData = useMemo(() => {
		return data
			.map((item) => ({
				name: item.name,
				date: new Date(item.date).toLocaleDateString("es-CO", {
					weekday: "short",
					month: "short",
					day: "numeric",
				}),
				hours: item.hour,
				minutes: item.minutes,
				totalHours: item.hour + item.minutes / 60,
			}))
			.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
	}, [data]);

	// Calcular estadísticas
	const stats = useMemo(() => {
		const totalHours = chartData.reduce(
			(acc, item) => acc + item.totalHours,
			0,
		);
		const avgHours = totalHours / chartData.length || 0;
		const maxSession = Math.max(...chartData.map((item) => item.totalHours));
		const minSession = Math.min(...chartData.map((item) => item.totalHours));

		return {
			totalHours: totalHours.toFixed(1),
			avgHours: avgHours.toFixed(1),
			maxSession: maxSession.toFixed(1),
			minSession: minSession.toFixed(1),
			sessions: chartData.length,
		};
	}, [chartData]);

	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Hours Chart</CardTitle>
					<CardDescription>No data available for visualization</CardDescription>
				</CardHeader>
				<CardContent className="h-64 flex items-center justify-center text-muted-foreground">
					Select a model and date range to view charts
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Estadísticas */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total Hours</CardDescription>
						<CardTitle className="text-2xl">{stats.totalHours}h</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Sessions</CardDescription>
						<CardTitle className="text-2xl">{stats.sessions}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Average</CardDescription>
						<CardTitle className="text-2xl">{stats.avgHours}h</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Max Session</CardDescription>
						<CardTitle className="text-2xl">{stats.maxSession}h</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Min Session</CardDescription>
						<CardTitle className="text-2xl">{stats.minSession}h</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Gráficos */}
			<Tabs defaultValue="bar" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="bar">Bar Chart</TabsTrigger>
					<TabsTrigger value="line">Line Chart</TabsTrigger>
				</TabsList>

				<TabsContent value="bar" className="space-y-4">
					<BarChartComponent
						title="Daily Hours (Bar Chart)"
						description="Hours worked per day shown as bars"
						data={chartData}
						config={{
							totalHours: {
								label: "hours",
								color: "var(--chart-1)",
							},
						}}
						xAxisKey="name"
						bars={[
							{
								dataKey: "totalHours",
								fill: "var(--chart-3)",
								radius: 9,
							},
						]}
					/>
				</TabsContent>

				<TabsContent value="line" className="space-y-4">
					<LineChartComponent
						title="Daily Hours Trend (Line Chart)"
						description="Hours worked per day showing trends over time"
						data={chartData}
						config={{
							totalHours: {
								label: "Hours",
								color: "var(--chart-1)",
							},
						}}
						xAxisKey="name"
						lines={[
							{
								dataKey: "totalHours",
								stroke: "var(--chart-1)",
								type: "natural",
							},
						]}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
