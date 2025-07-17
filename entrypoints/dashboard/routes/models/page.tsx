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

export function Models() {
  const models = useModelsStore((state) => state.models);
  return (
    <Layout>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-0">
        {models.map((model) => (
          <Card
            key={model.id}
            className="bg-muted/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-x-4">
                <div className="border rounded-full flex size-12 justify-center items-center bg-background">
                  {typeof model.icon === "string" ? (
                    <span className="text-2xl">{model.icon}</span>
                  ) : (
                    <model.icon className="size-6" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription>{model.site}</CardDescription>
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
                  <span className="font-medium">Platforms</span>
                  <span className="text-muted-foreground">
                    {model.platform.length}
                  </span>
                </div>
                {model.retentionRate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Retention</span>
                    <span className="text-muted-foreground">
                      {model.retentionRate}%
                    </span>
                  </div>
                )}
                {model.coversionRate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Conversion</span>
                    <span className="text-muted-foreground">
                      {model.coversionRate}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
