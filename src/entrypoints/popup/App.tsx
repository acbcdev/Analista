import { useChaturbateTags } from "@/hooks/useChaturbateTags";
import { useHoursExtraction } from "@/hooks/useHoursExtraction";
import { openDashboard } from "@/lib/action";
import { AppHeader } from "./components/AppHeader";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { StatusCard } from "./components/StatusCard";
import { TipMenuInjection } from "./components/TipMenuInjection";
import "./App.css";

function App() {
	const { exportTags, saveAndViewTags } = useChaturbateTags();
	const { extractAndSaveHours } = useHoursExtraction();

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
			/>

			<TipMenuInjection />

			<StatusCard />
		</main>
	);
}

export default App;
