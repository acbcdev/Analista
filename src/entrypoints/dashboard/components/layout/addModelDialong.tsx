import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useModelsStore } from "@/store/models";
import type { Platfoms } from "@/types/model";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	icon: z.string().max(3).min(1),
	site: z.string().min(2).max(50),
});

type PlatfomsItem = {
	label: string;
	value: Platfoms;
};

const PLATFORMS: PlatfomsItem[] = [
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
	const [isOpen, setIsOpen] = useState(false);
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
		const hasPlatformErrors =
			platforms.some(
				(item) =>
					!item.platform || !item.userName || item.userName.trim() === "",
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
				className="sm:max-w-lg md:min-w-[50rem] md:min-h-[80dvh] "
			>
				<motion.div layout>
					<DialogHeader className="mb-8">
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
								<AnimatePresence>
									{platformNumber.map((i, index) => (
										<motion.div
											key={i}
											initial={index !== 0 && { opacity: 0, x: -100 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 100 }}
											transition={{ duration: 0.3 }}
											layout
										>
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
															<SelectItem
																key={platform.value}
																value={platform.value}
															>
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
																prev.filter((_, i) => i !== index),
															);
															setError(null);
															setPlatforms((prev) =>
																prev.filter((_, i) => i !== index),
															);
														}}
													>
														<X />
													</Button>
												)}
											</div>
										</motion.div>
									))}
								</AnimatePresence>

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
										<FormLabel>Name of Site</FormLabel>
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
											<Popover onOpenChange={setIsOpen} open={isOpen}>
												<PopoverTrigger asChild>
													<Button variant="outline">
														{emoji ? emoji : "Select Emoji"}
													</Button>
												</PopoverTrigger>
												<PopoverContent
													side="top"
													onWheel={(e) => e.stopPropagation()}
													className="p-0 m-0  border-none bg-transparent"
												>
													<EmojiPicker
														className="h-[326px] rounded-lg border px-0.5 py-1 shadow-md"
														onEmojiSelect={({ emoji }) => {
															setEmoji(emoji);
															setIsOpen(false);
															field.onChange(emoji);
														}}
														{...field}
													>
														<EmojiPickerSearch />
														<EmojiPickerContent />
														<EmojiPickerFooter />
													</EmojiPicker>
												</PopoverContent>
											</Popover>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
					<DialogFooter>
						<Button type="submit" form="createModel" className="mt-8">
							Add
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};
