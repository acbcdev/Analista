import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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
import type { Model, Platfoms } from "@/types/model";

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

interface EditModelDialogProps {
	model: Model | null;
	isOpen: boolean;
	onClose: () => void;
}

export const EditModelDialog = ({
	model,
	isOpen,
	onClose,
}: EditModelDialogProps) => {
	const updateModel = useModelsStore((state) => state.updateModel);
	const [isEmojiOpen, setIsEmojiOpen] = useState(false);
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

	// Update form when model changes
	useEffect(() => {
		if (model && isOpen) {
			form.reset({
				name: model.name,
				icon: model.icon as string,
				site: model.site,
				platforms: model.platform.map((p) => ({
					platform: p.id,
					userName: p.userName,
				})),
			});
			setEmoji(model.icon as string);
		}
	}, [model, isOpen, form]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (!model) return;

		updateModel(model.id, {
			name: values.name,
			icon: values.icon,
			site: values.site,
			platform: values.platforms.map((item) => ({
				id: item.platform as Platfoms,
				userName: item.userName.trim(),
			})),
			updatedAt: Date.now(),
		});

		toast.success("Model updated successfully!");
		onClose();
	}

	const handleClose = () => {
		form.reset();
		setEmoji(null);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent
				aria-describedby="modal-edit-model"
				className="sm:max-w-lg md:min-w-[50rem] md:min-h-[80dvh]"
			>
				<motion.div layout>
					<DialogHeader className="mb-8">
						<DialogTitle>Edit Model</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							id="editModel"
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
													<FormItem className="min-w-40">
														<FormControl>
															<Select
																onValueChange={field.onChange}
																value={field.value}
															>
																<SelectTrigger>
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
											<Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
												<PopoverTrigger asChild>
													<Button variant="outline">
														{emoji ? emoji : "Select Emoji"}
													</Button>
												</PopoverTrigger>
												<PopoverContent
													side="top"
													onWheel={(e) => e.stopPropagation()}
													className="p-0 m-0 border-none bg-transparent"
												>
													<EmojiPicker
														className="h-[326px] rounded-lg border px-0.5 py-1 shadow-md"
														onEmojiSelect={({ emoji }) => {
															setEmoji(emoji);
															setIsEmojiOpen(false);
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
							onClick={handleClose}
							className="mt-8"
						>
							Cancel
						</Button>
						<Button type="submit" form="editModel" className="mt-8">
							Update Model
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};
