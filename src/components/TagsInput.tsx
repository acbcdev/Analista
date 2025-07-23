import { type Tag, TagInput } from "emblor";
import { type SetStateAction, useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TagsInputProps {
	/** Current tags value */
	value?: Tag[];
	/** Callback when tags change */
	onChange?: (tags: Tag[]) => void;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Label text for the input */
	label?: string;
	/** Whether to show the label */
	showLabel?: boolean;
	/** Additional CSS classes for the container */
	className?: string;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Maximum number of tags allowed */
	maxTags?: number;
	/** ID for the input element */
	id?: string;
	/** Whether to show the "Built with emblor" credit */
	ref?: React.Ref<HTMLInputElement>;
}

const TagsInput = ({ value = [], onChange, maxTags }: TagsInputProps) => {
	const [tags, setTags] = useState<Tag[]>(value);

	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	return (
		<TagInput
			placeholder="Add a tag"
			styleClasses={{
				tagList: {
					container: "gap-1",
				},
				input:
					"rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 mb-2",
				tag: {
					body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
					closeButton:
						"absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
				},
			}}
			activeTagIndex={activeTagIndex}
			setActiveTagIndex={setActiveTagIndex}
			inlineTags={false}
			inputFieldPosition="top"
			tags={tags}
			setTags={(value) => {
				setTags((prev) => {
					// Handle both direct value and function updates
					const tagsToSet = typeof value === "function" ? value(prev) : value;
					if (maxTags && tagsToSet.length > maxTags) {
						return prev; // Prevent adding more tags than allowed
					}
					onChange?.(tagsToSet);
					return tagsToSet;
				});
			}}
		/>
	);
};

TagsInput.displayName = "TagsInput";

export { TagsInput, type TagsInputProps };
