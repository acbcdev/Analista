import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
	platforms: z
		.array(
			z.object({
				platform: z.string().min(1, "Platform is required"),
				userName: z.string().min(1, "Username is required"),
			}),
		)
		.min(1, "At least one platform is required"),
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

export const AddModelDialog = () => {
	const isAddingModel = useModelsStore((state) => state.isAddingModel);
	const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);
	const addModel = useModelsStore((state) => state.addModel);
	const [isOpen, setIsOpen] = useState(false);
	const [emoji, setEmoji] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			icon: "🙉",
			site: "",
			platforms: [{ platform: "", userName: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "platforms",
	});
	function onSubmit(values: z.infer<typeof formSchema>) {
		addModel({
			name: values.name,
			icon: values.icon,
			site: values.site,
			platform: values.platforms.map((item) => ({
				id: item.platform as Platfoms,
				userName: item.userName.trim(),
			})),
			streams: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
			id: nanoid(7),
		});

		// Reset form and platforms properly
		form.reset({
			name: "",
			icon: "🙉",
			site: "",
			platforms: [{ platform: "", userName: "" }],
		});
		setEmoji(null);
		toast.success("Model added successfully! Add another or close the dialog.");
	}

	// Function to close modal and reset everything
	const handleCloseModal = () => {
		form.reset({
			name: "",
			icon: "🙉",
			site: "",
			platforms: [{ platform: "", userName: "" }],
		});
		setEmoji(null);
		setIsAddingModel(false);
	};

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

							<div className="space-y-4">
								<FormLabel>Platforms</FormLabel>
								<div className="space-y-2">
									{fields.map((fieldItem, index) => (
										<div key={fieldItem.id} className="flex gap-x-2">
											<FormField
												control={form.control}
												name={`platforms.${index}.platform`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Select
																onValueChange={field.onChange}
																value={field.value}
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
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name={`platforms.${index}.userName`}
												render={({ field }) => (
													<FormItem className="flex-1">
														<FormControl>
															<Input {...field} placeholder="Username" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											{index > 0 && (
												<Button
													type="button"
													variant="destructive"
													size="icon"
													onClick={() => remove(index)}
												>
													<X className="h-4 w-4" />
												</Button>
											)}
										</div>
									))}
								</div>

								<Button
									type="button"
									disabled={fields.length >= PLATFORMS.length}
									onClick={() => append({ platform: "", userName: "" })}
									size="lg"
									className="w-full"
									variant="outline"
								>
									Add Platform
								</Button>
							</div>

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
					<DialogFooter className="flex flex-col sm:flex-row gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={handleCloseModal}
							className="mt-8"
						>
							Close
						</Button>
						<Button type="submit" form="createModel" className="mt-8">
							Add Model
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};
