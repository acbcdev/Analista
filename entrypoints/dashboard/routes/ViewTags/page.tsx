import { Tags } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./dataTable";
import { storage } from "@wxt-dev/storage";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";
import { CHATURBATE_TAGS_URL } from "@/const/url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type tagsStore = {
  data: Tags[];
  createAt: number;
  name: string;
};

export function TagsView() {
  const [allTags, setAllTags] = useState<tagsStore[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [data, setData] = useState<Tags[]>([]);
  const getData = async () => {
    // Fetch data from your API here.
    const selectedTag = await storage.getItem("local:selectedTag");
    const data = await storage.getItem("local:tags");
    setAllTags(data as tagsStore[]);
    setSelectedTag(selectedTag as string);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      <section className="flex items-center justify-between gap-y-2 mx-2 p-4 pt-0">
        <div className="flex gap-x-2 text-sm">
          {allTags.length === 0 ? (
            <div className="flex justify-center gap-x-2 items-center ">
              <p className="text-lg">No tags Found</p>
              <a
                href={`${CHATURBATE_TAGS_URL}/?sort=-vc`}
                className="hover:text-foreground/50 duration-200 inline-flex items-center"
              >
                <ExternalLink className="size-4 " />
              </a>
            </div>
          ) : (
            <Select
              onValueChange={async (value) => {
                await storage.setItem("local:selectedTag", value);
                const tag = allTags.find((tag) => tag.name === value);
                setData(tag?.data || []);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Date" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((tag) => (
                  <SelectItem key={tag.createAt} value={tag.name}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button variant="ghost" size={"icon"} onClick={getData}>
          <RefreshCw />
        </Button>
      </section>

      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
