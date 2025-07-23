import { MoreHorizontal, Plus, Trash, Users } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useModelsStore } from "@/store/models";

export function Models() {
	const models = useModelsStore((state) => state.models);
	const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);
	const removeModel = useModelsStore((state) => state.removeModel);
	const [wantsToDelete, setWantsToDelete] = useState(false);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);
	// Estado vacío cuando no hay modelos
	if (models.length === 0) {
		return (
			<Layout>
				<div className="data-empty">
					<div className="mb-6">
						<Users className="size-16 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-2xl font-semibold mb-2">No models yet</h2>
						<p className="text-muted-foreground max-w-md">
							Get started by adding your first model to track performance across
							different platforms.
						</p>
					</div>
					<Button onClick={() => setIsAddingModel(true)} className="gap-2">
						<Plus className="size-4" />
						Add First Model
					</Button>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="flex justify-between items-center p-4 pb-0">
				<div>
					<h1 className="text-2xl font-semibold">Models</h1>
					<p className="text-muted-foreground">
						Manage your models and track their performance
					</p>
				</div>
				<Button onClick={() => setIsAddingModel(true)} className="gap-2">
					<Plus className="size-4" />
					Add Model
				</Button>
			</div>
			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-4">
				{models.map((model) => (
					<Card
						key={model.id}
						className="bg-muted/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="flex items-center gap-x-4">
								<div className="border rounded-full flex size-12 justify-center items-center bg-background">
									{typeof model.icon === "string" ? (
										<span className="text-2xl">{model.icon}</span>
									) : (
										<model.icon className="size-6" />
									)}
								</div>
								<div>
									<CardTitle className="text-lg">{model.name}</CardTitle>
									<CardDescription>{model.site}</CardDescription>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant={"ghost"} size="icon">
										<MoreHorizontal className="size-5 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem>View Details</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {
											setWantsToDelete(true);
											setIdToDelete(model.id);
										}}
										className="text-destructive-foreground focus:bg-destructive/50 focus:text-destructive-foreground"
									>
										<Trash className="size-4 text-destructive-foreground" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardHeader>
						<CardContent>
							<div className="text-sm space-y-2 mt-2">
								<div className="flex justify-between">
									<span className="font-medium">Platforms</span>
									<span className="text-muted-foreground">
										{model.platform.length}
									</span>
								</div>
								{model.retentionRate && (
									<div className="flex justify-between">
										<span className="font-medium">Retention</span>
										<span className="text-muted-foreground">
											{model.retentionRate}%
										</span>
									</div>
								)}
								{model.coversionRate && (
									<div className="flex justify-between">
										<span className="font-medium">Conversion</span>
										<span className="text-muted-foreground">
											{model.coversionRate}%
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			<AlertDialog
				open={!!idToDelete && wantsToDelete}
				onOpenChange={setWantsToDelete}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Model</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this model?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => {
									if (!idToDelete) return;
									removeModel(idToDelete);
								}}
							>
								Delete
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Layout>
	);
}
