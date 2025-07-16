import TopActions from "@/entrypoints/popup/components/topActions";
import "./App.css";
import { ChartAreaAxes } from "@/components/charts/area/chartAxes";

function App() {
  return (
    <main className="flex flex-col h-full gap-y-1 p-4 ">
      <TopActions />
      <ChartAreaAxes />
    </main>
  );
}

export default App;
