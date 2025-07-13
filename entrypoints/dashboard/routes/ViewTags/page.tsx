import { Tags } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import { storage } from "@wxt-dev/storage";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function TagsView() {
  const [data, setData] = useState<Tags[]>([]);
  const [date, setDate] = useState<number>(0);
  const getData = async () => {
    // Fetch data from your API here.
    const data = await storage.getItem("local:tags");
    setData(data as Tags[]);
    storage.getItem("local:tags-date").then((i) => setDate(i as number));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <section className="flex items-center justify-between gap-y-2 mx-2 p-4 pt-0">
        <div className="flex gap-x-2 text-sm">
          <span className="font-bol ">Date</span>
          {new Date(date).toLocaleString("es")}
        </div>
        <Button variant="ghost" size={"icon"} onClick={getData}>
          <RefreshCw />
        </Button>
      </section>

      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
