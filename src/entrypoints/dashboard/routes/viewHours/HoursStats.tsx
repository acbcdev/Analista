import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FIXED_NUMBER } from "@/const";
import type { Hours } from "@/types";

type HoursStatsProps = {
	data: Hours[];
};

export default function HoursStats({ data }: HoursStatsProps) {
	const stats = useMemo(() => {
		const totalHours = data.reduce((acc, item) => acc + item.totalHours, 0);
		const avgHours = totalHours / data.length || 0;
		const maxSession = Math.max(...data.map((item) => item.totalHours));
		const minSession = Math.min(...data.map((item) => item.totalHours));

		return {
			totalHours: totalHours.toFixed(FIXED_NUMBER),
			avgHours: avgHours.toFixed(FIXED_NUMBER),
			maxSession: maxSession.toFixed(FIXED_NUMBER),
			minSession: minSession.toFixed(FIXED_NUMBER),
			sessions: data.length,
		};
	}, [data]);
	return (
		<div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-2">
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
	);
}
