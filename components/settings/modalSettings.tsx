import { Cog, Database, UsersRound } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { use } from "react";
import { useModelsStore } from "@/store/models";

export const Settings = () => {
  const models = useModelsStore((state) => state.models);
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon">
          <Cog />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs>
          <TabsList>
            <TabsTrigger value="models">
              <UsersRound /> Models
            </TabsTrigger>
            <TabsTrigger value="db">
              <Database /> Database
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models">
            <div>Models</div>
            {models.map((model) => (
              <div key={model.name}>{model.name}</div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
