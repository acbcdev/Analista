import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Separator } from "@radix-ui/react-dropdown-menu";
import EmojiPicker, { Theme } from "emoji-picker-react";
const formSchema = z.object({
  name: z.string().min(2).max(50),
  icon: z.string().max(1),
  site: z.string().min(2).max(50),
  cbUsername: z.string().min(2).max(50).optional(),
  scUsername: z.string().min(2).max(50).optional(),
  csUsername: z.string().min(2).max(50).optional(),
});

export const AddModelDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: "",
      site: "",
      cbUsername: "",
      scUsername: "",
      csUsername: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add model</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Separator />
              <FormField
                control={form.control}
                name="cbUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>chaturbate Username</FormLabel>
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

              <FormField
                control={form.control}
                name="scUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripchat Username</FormLabel>
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

              <FormField
                control={form.control}
                name="csUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camsoda Username</FormLabel>
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

              <Button type="submit">Add</Button>
            </form>
          </Form>
        </DialogHeader>
        <DialogFooter>
          <Button className="btn btn-primary">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
