import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useModelsStore } from "@/store/models";
import { DataTable } from "./dataTable";
import { columns } from "./columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import type { Stream } from "@/types/stream";

export function Streams() {
  const models = useModelsStore((state) => state.models);
  const streams = models.flatMap((model) =>
    model.streams.map((stream) => ({ ...stream, model: { name: model.name } }))
  );

  return (
    <Layout>
      <div className="p-4 pt-0">
        <DataTable columns={columns} data={streams} />
      </div>
    </Layout>
  );
}

