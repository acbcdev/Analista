import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import type { Model } from "@/types/model";

interface PlatformEmptyStateProps {
	filteredModels: Model[];
}

export function PlatformEmptyState({ filteredModels }: PlatformEmptyStateProps) {
	const platformUrls = {
		chaturbate: CBHOURS,
		camsoda: SODAHOURS_URL,
		stripchat: STRIPHOURS_URL,
	};

	// Obtener plataformas únicas de los modelos filtrados
	const uniquePlatforms = new Set(
		filteredModels.flatMap((model) =>
			model.platform
				.filter((p) =>
					["chaturbate", "camsoda", "stripchat"].includes(p.id),
				)
				.map((p) => p.id),
		),
	);

	return (
		<div className="data-empty">
			<div className="mb-8">
				<Clock className="size-16 text-muted-foreground mx-auto mb-4" />
				<h2 className="text-2xl font-semibold mb-2">
					Extract hours data from platforms
				</h2>
				<p className="text-muted-foreground max-w-md mb-6">
					Visit the analytics pages of your models to extract hours data.
					Click on the platform links below:
				</p>
			</div>

			<div className="grid grid-3 gap-4 w-full max-w-2xl">
				{Array.from(uniquePlatforms).map((platform) => {
					const modelNames = filteredModels
						.filter((model) =>
							model.platform.some((p) => p.id === platform),
						)
						.map(
							(model) =>
								model.platform.find((p) => p.id === platform)?.userName,
						)
						.filter(Boolean);

					return (
						<Card key={platform} className="text-left">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg capitalize flex items-center gap-2">
									{platform}
									<ExternalLink className="size-4" />
								</CardTitle>
								<CardDescription>
									Models: {modelNames.join(", ")}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex flex-wrap gap-2">
									{modelNames.map((username) => (
										<Button
											key={username}
											variant="outline"
											size="sm"
											asChild
											className="gap-2"
										>
											<a
												href={`${platformUrls[platform as keyof typeof platformUrls]}/${username}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ExternalLink className="size-3" />
												{username}
											</a>
										</Button>
									))}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
