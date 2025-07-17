import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { Hours, HoursStorage } from "@/types";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function HoursView() {
  const [allHours, setAllHours] = useState<HoursStorage[]>([]);
  const [data, setData] = useState<Hours[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    storage.getItem("local:hours").then((res) => {
      const arr = Object.values(res ?? {});
      setAllHours(arr as HoursStorage[]);
    });
    const unwatch = storage.watch("local:hours", (newValue) => {
      const arr = Object.values(newValue ?? {});
      setAllHours(arr as HoursStorage[]);
    });
    return () => {
      unwatch();
    };
  }, []);

  const hours = data.reduce((acc, item) => acc + item.hour, 0);
  const minutes = data.reduce((acc, item) => acc + item.minutes, 0);
  const total = (hours * 60 + minutes) / 60;

  if (!allHours || allHours.length === 0) {
    return (
      <Layout>
        <div className="px-6 pt-10">
          <div className="flex gap-x-2 text-sm">
            <p className="text-lg">No models Found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6  pb-2">
        <div className="flex justify-between items-center gap-x-2 text-sm py-2 ">
          <Select
            onValueChange={async (value) => {
              const hours = allHours.find((hours) => hours.name === value);
              setData(hours?.data || []);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Model" />
            </SelectTrigger>
            <SelectContent>
              {allHours.map((hours: HoursStorage) => (
                <SelectItem key={hours.createAt} value={hours.name}>
                  {hours.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              navigator.clipboard.writeText(tableRef.current?.innerText || "");
              toast.success("Copied to clipboard");
            }}
          >
            <Copy />
          </Button>
        </div>
        <div className="border rounded-md overflow-hidden ">
          <Table className="w-full" ref={tableRef}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.date}>
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>{item.hour}</TableCell>
                  <TableCell>{item.minutes}</TableCell>
                  <TableCell className="text-right">{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {data.length !== 0 && (
              <TableFooter>
                <TableRow>
                  <TableHead className="w-[100px]">Totals</TableHead>
                  <TableHead>{hours}</TableHead>
                  <TableHead>{minutes}</TableHead>
                  <TableHead className="text-right">{total}</TableHead>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>
    </Layout>
  );
}
