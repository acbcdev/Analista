import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import EmojiPicker, { Theme } from "emoji-picker-react";
import { useModelsStore } from "@/store/models";
import { Platfoms } from "@/types/model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X } from "lucide-react";
const formSchema = z.object({
  name: z.string().min(2).max(50),
  icon: z.string().max(1),
  site: z.string().min(2).max(50),
});

const PLATFORMS: { label: string; value: Platfoms }[] = [
  { label: "Chaturbate", value: "chaturbate" },
  { label: "Stripchat", value: "stripchat" },
  { label: "Camsoda", value: "camsoda" },
  {
    label: "Cherry.tv",
    value: "cherry",
  },
  {
    label: "Stremate",
    value: "stremate",
  },
  {
    label: "Cam4",
    value: "cam4",
  },
  {
    label: "MyFreeCams",
    value: "myfreecams",
  },
];

type formPlatforms = {
  platform: Platfoms;
  userName: string;
};

export const AddModelDialog = () => {
  const isAddingModel = useModelsStore((state) => state.isAddingModel);
  const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);
  const [platformNumber, setPlatformNumber] = useState([1]);
  const [platforms, setPlatforms] = useState<formPlatforms[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "",
      site: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    console.log("Platforms:", platforms);
  }

  return (
    <Dialog open={isAddingModel} onOpenChange={setIsAddingModel}>
      <DialogContent className="sm:max-w-lg md:min-w-[700px] md:min-h-[700px]">
        <DialogHeader>
          <DialogTitle>Add model</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="createModel"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <section className="space-y-2">
              {platformNumber.map((_, index) => (
                <div className="flex gap-x-2">
                  <Select
                    onValueChange={(value) => {
                      const updatedPlatforms = [...platforms];
                      updatedPlatforms[index] = {
                        ...updatedPlatforms[index],
                        platform: value as Platfoms,
                      };
                      setPlatforms(updatedPlatforms);
                    }}
                  >
                    <SelectTrigger className="min-w-40">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    onChange={(e) => {
                      const updatedPlatforms = [...platforms];
                      platforms[index] = {
                        ...updatedPlatforms[index],
                        userName: e.target.value,
                      };
                      setPlatforms(platforms);
                    }}
                  />
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        setPlatformNumber((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                disabled={platformNumber.length >= PLATFORMS.length}
                onClick={() =>
                  setPlatformNumber((prev) => [...prev, prev.length + 1])
                }
                className="mt-2"
                variant="outline"
              >
                New Platform
              </Button>
            </section>

            <FormField
              control={form.control}
              name="site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the site where the model is active.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <EmojiPicker skinTonesDisabled theme={Theme.DARK} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="createModel">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
