import { useChaturbateTags } from "@/hooks/useChaturbateTags";
import { useIsHoursUrl } from "@/hooks/useIsHoursUrl";
import { openDashboard } from "@/lib/action";
import { AppHeader } from "./components/AppHeader";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { StatusCard } from "./components/StatusCard";
import { TipMenuInjection } from "./components/TipMenuInjection";
import "./App.css";
import { urlValidators, useUrlValidator } from "@/hooks/useUrlValidator";

function App() {
	const { exportTags, saveAndViewTags } = useChaturbateTags();
	const { extractAndSaveHours } = useHoursExtraction();
	const isHoursUrl = useIsHoursUrl();
	const isStripchatUrl = useUrlValidator(urlValidators.isStripChat);

	return (
		<main className="p-4 bg-background">
			<AppHeader
				onOpenDashboard={() => openDashboard()}
				onOpenSettings={() => {
					/* TODO: Implement settings */
				}}
			/>

			<QuickActionsCard
				onViewTags={() => saveAndViewTags()}
				onExportTags={() => exportTags("exportJson")}
				onExtractHours={() => extractAndSaveHours()}
				showHoursSection={isHoursUrl}
			/>

			{isStripchatUrl && <TipMenuInjection />}

			<StatusCard />
		</main>
	);
}

export default App;
