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
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
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
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
const formSchema = z.object({
  name: z.string().min(2).max(50),
  icon: z.string().max(3).min(1),
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
  const addModel = useModelsStore((state) => state.addModel);

  const [platformNumber, setPlatformNumber] = useState([1]);
  const [platforms, setPlatforms] = useState<formPlatforms[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "🙉",
      site: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("Form submitted with values:", values);
    console.log("Platforms:", platforms);
    const hasPlatformErrors =
      platforms.some(
        (item) =>
          !item.platform || !item.userName || item.userName.trim() === ""
      ) || platforms.length === 0;
    if (hasPlatformErrors) {
      setError("Please add at least one platform");
      return;
    }
    setError(null);
    addModel({
      name: values.name,
      icon: values.icon,
      site: values.site,
      platform: platforms.map((item) => ({
        id: item.platform,
        userName: item.userName.trim(),
      })),
      streams: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: nanoid(7),
    });
    form.reset();
    setPlatformNumber([1]);
    setPlatforms([]);
    setError(null);
    setEmoji(null);
    toast.success("Model added successfully");
  }

  return (
    <Dialog open={isAddingModel} onOpenChange={setIsAddingModel}>
      <DialogContent
        aria-describedby="modal-add-model"
        className="sm:max-w-lg md:min-w-[700px] md:min-h-[700px]"
      >
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
                      onClick={() => {
                        setPlatformNumber((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setError(null);
                        setPlatforms((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
              <p>
                {error && <span className="mx-2 text-red-500">{error}</span>}
              </p>
              <Button
                type="button"
                disabled={platformNumber.length >= PLATFORMS.length}
                onClick={() =>
                  setPlatformNumber((prev) => [...prev, prev.length + 1])
                }
                size={"lg"}
                className="mt-2 w-full"
                variant="outline"
              >
                New platform
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
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {emoji ? emoji : "Select Emoji"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0 m-0  border-none bg-transparent">
                        <EmojiPicker
                          onEmojiClick={(e) => {
                            setEmoji(e.emoji);
                            field.onChange(e.emoji);
                          }}
                          {...field}
                          autoFocusSearch
                          emojiStyle={EmojiStyle.NATIVE}
                          skinTonesDisabled
                          theme={Theme.DARK}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
