import { Cog, Database, UsersRound } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelsStore } from "@/store/models";

export const Settings = () => {
	const models = useModelsStore((state) => state.models);
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="ghost" size="icon">
					<Cog />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Tabs>
					<TabsList>
						<TabsTrigger value="models">
							<UsersRound /> Models
						</TabsTrigger>
						<TabsTrigger value="db">
							<Database /> Database
						</TabsTrigger>
					</TabsList>

					<TabsContent value="models">
						<div>Models</div>
						{models.map((model) => (
							<div key={model.name}>{model.name}</div>
						))}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};
