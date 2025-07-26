import type { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
	label: string;
	variant?: "default" | "blue" | "green";
}

export function StatusBadge({ label, variant = "default" }: StatusBadgeProps) {
	const variants = {
		default: "bg-secondary text-secondary-foreground",
		blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
		green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
	};

	return (
		<span className={`px-2 py-1 rounded-md text-xs ${variants[variant]}`}>
			{label}
		</span>
	);
}

interface ExtractionSectionHeaderProps {
	icon: LucideIcon;
	title: string;
	badge: string;
	iconColor?: string;
	badgeVariant?: "default" | "blue" | "green";
}

export function ExtractionSectionHeader({
	icon: Icon,
	title,
	badge,
	iconColor = "text-blue-500",
	badgeVariant = "default",
}: ExtractionSectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Icon className={`h-4 w-4 ${iconColor}`} />
				<span className="text-sm font-medium">{title}</span>
			</div>
			<StatusBadge label={badge} variant={badgeVariant} />
		</div>
	);
}
