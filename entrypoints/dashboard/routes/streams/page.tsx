import { MoreHorizontal, Trash } from "lucide-react";
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
import type { Strema } from "@/types/stream";

export function Streams() {
  const models = useModelsStore((state) => state.models);
  const streams = models.flatMap((model) => model.streams);

  return (
    <Layout>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-0">
        {streams.map((stream: Strema) => (
          <Card
            key={stream.id}
            className="bg-muted/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-x-4">
                <div>
                  <CardTitle className="text-lg">{stream.title}</CardTitle>
                  <CardDescription>{stream.platform}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="size-5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive-foreground focus:bg-destructive/50 focus:text-destructive-foreground">
                    <Trash className=" text-destructive-foreground" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Views</span>
                  <span className="text-muted-foreground">{stream.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tokens</span>
                  <span className="text-muted-foreground">{stream.tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Privates</span>
                  <span className="text-muted-foreground">
                    {stream.privates}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration</span>
                  <span className="text-muted-foreground">
                    {stream.time.duration} minutes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
