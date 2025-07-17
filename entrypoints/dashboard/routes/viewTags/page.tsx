import { storage } from "@wxt-dev/storage";
import { ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHATURBATE_TAGS_URL } from "@/const/url";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import type { Tags } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./dataTable";

type tagsStore = {
  data: Tags[];
  createAt: number;
  name: string;
};

export function TagsView() {
  const [allTags, setAllTags] = useState<tagsStore[]>([]);
  const [data, setData] = useState<Tags[]>([]);

  useEffect(() => {
    storage.getItem("local:tags").then((res) => {
      setAllTags(res as tagsStore[]);
    });
    const unwatch = storage.watch("local:tags", (newValue) => {
      setAllTags(newValue as tagsStore[]);
    });
    return () => {
      unwatch();
    };
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
      </section>

      <DataTable columns={columns} data={data} />
    </Layout>
  );
}
