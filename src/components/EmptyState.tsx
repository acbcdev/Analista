import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
	actionHref?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	onAction,
	actionHref,
}: EmptyStateProps) {
	return (
		<div className="data-empty">
			<div className="mb-6">
				<Icon className="size-16 text-muted-foreground mx-auto mb-4" />
				<h2 className="text-2xl font-semibold mb-2">{title}</h2>
				<p className="text-muted-foreground max-w-md mb-4">{description}</p>
				{actionLabel && (onAction || actionHref) && (
					<Button onClick={onAction} asChild={!!actionHref} className="gap-2">
						{actionHref ? (
							<a href={actionHref} target="_blank" rel="noopener noreferrer">
								{actionLabel}
							</a>
						) : (
							actionLabel
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
