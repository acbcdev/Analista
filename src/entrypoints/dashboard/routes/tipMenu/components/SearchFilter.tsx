import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

export function SearchFilter({
	searchTerm,
	onSearchChange,
}: SearchFilterProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 space-y-2">
						<Label htmlFor="search">Search menus</Label>
						<Input
							id="search"
							placeholder="Search by name or description..."
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
