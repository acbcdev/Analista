import { Users } from "lucide-react";
// import { parseAsInteger, useQueryState } from "nuqs";
import Layout from "@/entrypoints/dashboard/components/layout/layout";

// import { useModelsStore } from "@/store/models";

const PANELS = [
  {
    title: "Total Models",
    icon: Users,
  },
  {},
];

export default function App() {
  // const [model, setModel] = useQueryState(
  //   "model",
  //   parseAsInteger.withDefault(0)
  // );
  // const models = useModelsStore((state) => state.models);
  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </Layout>
  );
}
