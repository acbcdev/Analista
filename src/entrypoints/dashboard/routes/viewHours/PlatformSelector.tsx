import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface PlatformSelectorProps {
	selectedPlatform: string;
	onPlatformChange: (platform: string) => void;
	className?: string;
}

export function PlatformSelector({ 
	selectedPlatform, 
	onPlatformChange, 
	className 
}: PlatformSelectorProps) {
	return (
		<div className={`flex items-center gap-x-2 ${className || ""}`}>
			<label className="font-medium mr-2">Platform:</label>
			<Select value={selectedPlatform} onValueChange={onPlatformChange}>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Select platform" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="chaturbate">Chaturbate</SelectItem>
					<SelectItem value="stripchat">Stripchat</SelectItem>
					<SelectItem value="camsoda">Camsoda</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
