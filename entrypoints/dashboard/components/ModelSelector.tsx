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
}

export function ModelSelector({ allHours, onModelSelect }: ModelSelectorProps) {
	const handleModelChange = async (value: string) => {
		const selectedHours = allHours.find((hours) => hours.name === value);
		console.log("Selected model data:", selectedHours?.data);
		onModelSelect(selectedHours?.data || []);
	};

	return (
		<Select onValueChange={handleModelChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select a Model" />
			</SelectTrigger>
			<SelectContent>
				{allHours?.map((hours: HoursStorage) => (
					<SelectItem key={hours.createAt} value={hours.name}>
						{hours.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
