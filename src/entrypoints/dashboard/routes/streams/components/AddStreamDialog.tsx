import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NumberInput } from "@/components/NumberInput";
import { TagsInput } from "@/components/TagsInput";
import { TimeInput } from "@/components/TimeInput";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useModelsStore } from "@/store/models";
import type { Platfoms } from "@/types/model";
import type { Stream } from "@/types/stream";

const formSchema = z.object({
	modelId: z.string().min(1, "Model is required"),
	platform: z.string().min(1, "Platform is required"),
	title: z.string().min(1, "Title is required").max(100),
	date: z.date({ required_error: "Date is required" }),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().min(1, "End time is required"),
	views: z.coerce.number().min(0, "Views must be positive"),
	tokens: z.coerce.number().min(0, "Tokens must be positive"),
	privates: z.coerce.number().min(0, "Privates must be positive"),
	tags: z.array(z.string().min(1).max(10)).optional(),
	notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddStreamDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const models = useModelsStore((state) => state.models);
	const addStreamToModel = useModelsStore((state) => state.addStreamToModel);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			modelId: "",
			platform: "",
			title: "",
			startTime: "",
			endTime: "",
			views: 0,
			tokens: 0,
			privates: 0,
			tags: [],
			notes: "",
		},
	});

	const selectedModel = models.find(
		(model) => model.id === form.watch("modelId"),
	);
	console.log(models);
	function onSubmit(values: FormValues) {
		const startDateTime = new Date(values.date);
		const endDateTime = new Date(values.date);

		// Parse time strings and set hours/minutes
		const [startHour, startMinute] = values.startTime.split(":").map(Number);
		const [endHour, endMinute] = values.endTime.split(":").map(Number);

		startDateTime.setHours(startHour, startMinute, 0, 0);
		endDateTime.setHours(endHour, endMinute, 0, 0);

		// If end time is before start time, assume it's the next day
		if (endDateTime <= startDateTime) {
			endDateTime.setDate(endDateTime.getDate() + 1);
		}

		const duration = endDateTime.getTime() - startDateTime.getTime();
		const durationInMinutes = Math.floor(duration / (1000 * 60));

		const newStream: Stream = {
			id: crypto.randomUUID(),
			title: values.title,
			views: values.views,
			platform: values.platform as Platfoms,
			tokens: values.tokens,
			privates: values.privates,
			tags: values.tags || [],
			time: {
				start: startDateTime.getTime(),
				end: endDateTime.getTime(),
				day: startDateTime.getDay(),
				duration: durationInMinutes,
			},
			users: [],
			usersPays: [],
			userOnlyView: [],
			userAnonymousView: [],
			chatActivity: {
				messages: 0,
				pm: 0,
			},
			peakHour: startDateTime.getHours(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			notes: values.notes || "",
		};

		addStreamToModel(values.modelId, newStream);
		toast.success("Stream added successfully!");
		setIsOpen(false);
		form.reset();
	}

	const handleClose = () => {
		setIsOpen(false);
		form.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="size-4" />
					Add Stream
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto px-3">
				<DialogHeader className="px-4">
					<DialogTitle>Add New Stream</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[65vh] px-2 pb-2">
					<Form {...form}>
						<form
							id="addStream"
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 px-2"
						>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="modelId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Model</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="min-w-40">
														<SelectValue placeholder="Select a model" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{models.map((model) => (
														<SelectItem key={model.id} value={model.id}>
															{typeof model.icon === "string"
																? model.icon
																: null}{" "}
															{model.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="platform"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Platform</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={!selectedModel}
											>
												<SelectTrigger className="min-w-40">
													<SelectValue placeholder="Select platform" />
												</SelectTrigger>
												<SelectContent>
													{selectedModel?.platform.map((platform) => (
														<SelectItem key={platform.id} value={platform.id}>
															{platform.id}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stream Title</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Enter stream title" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															field.value.toLocaleDateString()
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													autoFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Time</FormLabel>
											<FormControl>
												<TimeInput onChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endTime"
									render={({ field }) => (
										<FormItem>
											<FormLabel>End Time</FormLabel>
											<FormControl>
												<TimeInput onChange={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="views"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Views</FormLabel>
											<FormControl>
												<NumberInput {...field} minValue={0} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tokens"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tokens</FormLabel>
											<FormControl>
												<NumberInput {...field} minValue={0} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="privates"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Privates</FormLabel>
											<FormControl>
												<NumberInput {...field} minValue={0} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="tags"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tags</FormLabel>
										<FormControl>
											<TagsInput
												onChange={(tags) => {
													const tagsToSet = tags.map((tag) => tag.text);
													field.onChange(tagsToSet);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Notes</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Additional notes about the stream"
												rows={3}
												className="mb-2"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</ScrollArea>
				<DialogFooter className="px-4">
					<Button type="button" variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button type="submit" form="addStream">
						Add Stream
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
