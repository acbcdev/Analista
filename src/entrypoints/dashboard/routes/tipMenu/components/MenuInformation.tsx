import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MenuInformationProps {
	menuName: string;
	menuDescription: string;
	onMenuNameChange: (value: string) => void;
	onMenuDescriptionChange: (value: string) => void;
}

export function MenuInformation({
	menuName,
	menuDescription,
	onMenuNameChange,
	onMenuDescriptionChange,
}: MenuInformationProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Menu Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="menuName">Menu Name *</Label>
						<Input
							id="menuName"
							value={menuName}
							onChange={(e) => onMenuNameChange(e.target.value)}
							placeholder="Enter menu name..."
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="menuDescription">Description</Label>
						<Textarea
							id="menuDescription"
							value={menuDescription}
							onChange={(e) => onMenuDescriptionChange(e.target.value)}
							placeholder="Optional description..."
							className="min-h-[80px]"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
