interface LoadingFallbackProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function LoadingFallback({
	size = "md",
	className,
}: LoadingFallbackProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div className={`grid place-content-center h-[100dvh] ${className}`}>
			<div
				className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
			/>
		</div>
	);
}
