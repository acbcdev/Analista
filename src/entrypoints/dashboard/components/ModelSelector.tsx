import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Hours, HoursStorage } from "@/types";

interface ModelSelectorProps {
	allHours: HoursStorage[];
	onModelSelect: (data: Hours[]) => void;
	onAllModelsChange: (bol: boolean) => void;
}

const platformsComparison = {
	 chaturbate:"cb",
	camsoda: "cs",
	 stripchat: "sc",
};

export function ModelSelector({
	allHours,
	onModelSelect,
	onAllModelsChange,
}: ModelSelectorProps) {
	const handleModelChange = async (value: string) => {
		if (value === "grid") {
			onAllModelsChange(true);
			return;
		}
		const selectedHours = allHours.find((hours) => hours.name === value.split("-")[0] && hours.platform === value.split("-")[1]);
		onAllModelsChange(false);
		onModelSelect(selectedHours?.data || []);
	};

	return (
		<Select onValueChange={handleModelChange} value={allHours.length === 0 ? "grid" : ""}>
			<SelectTrigger className="w-[160px]">
				<SelectValue placeholder="Select a Model" />
			</SelectTrigger>
			<SelectContent>
				{allHours.length ===0  ?(
					<SelectItem value="grid" disabled>
						No models available
					</SelectItem>
				) : (
					<>
							<SelectItem value={"grid"} disabled={allHours.length ===0}>all models</SelectItem>
				{allHours?.map((hours: HoursStorage) =>
				{
					const platform = platformsComparison[hours.platform as keyof typeof platformsComparison] || hours.platform;
					return(
					<SelectItem key={hours.createAt} value={`${hours.name}-${hours.platform}`}>
						{hours.name} - {platform}
					</SelectItem>
				)})}
					</>
				)}
		
			</SelectContent>
		</Select>
	);
}
