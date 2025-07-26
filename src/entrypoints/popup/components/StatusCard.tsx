import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusIndicatorProps {
	color: "green" | "yellow" | "red";
	label: string;
}

function StatusIndicator({ color, label }: StatusIndicatorProps) {
	const colors = {
		green: "bg-green-500 text-green-600",
		yellow: "bg-yellow-500 text-yellow-600",
		red: "bg-red-500 text-red-600",
	};

	return (
		<div className="flex items-center gap-1">
			<div
				className={`w-2 h-2 ${colors[color].split(" ")[0]} rounded-full`}
			></div>
			<span className={`${colors[color].split(" ")[1]}`}>{label}</span>
		</div>
	);
}

interface StatusCardProps {
	message?: string;
	status?: "active" | "inactive" | "error";
}

export function StatusCard({
	message = "Ready to extract data",
	status = "active",
}: StatusCardProps) {
	const statusConfig = {
		active: { color: "green" as const, label: "Active" },
		inactive: { color: "yellow" as const, label: "Inactive" },
		error: { color: "red" as const, label: "Error" },
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-sm">Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground">{message}</span>
					<StatusIndicator {...statusConfig[status]} />
				</div>
			</CardContent>
		</Card>
	);
}
