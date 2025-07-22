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
		const selectedHours = allHours.find((hours) => hours.name === value);
		onAllModelsChange(false);
		onModelSelect(selectedHours?.data || []);
	};

	return (
		<Select onValueChange={handleModelChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select a Model" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={"grid"}>all models</SelectItem>
				{allHours?.map((hours: HoursStorage) => (
					<SelectItem key={hours.createAt} value={hours.name}>
						{hours.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
