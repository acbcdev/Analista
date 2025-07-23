import { ClockIcon } from "lucide-react";
import { Label } from "react-aria-components";
import { DateInput, TimeField } from "@/components/ui/datefield-rac";
import { cn } from "@/lib/utils";

interface TimeInputProps {
	/** Current time value */
	value?: string;
	/** Callback when time changes */
	onChange?: (value: string) => void;
	/** Label text for the input */
	label?: string;
	/** Whether to show the label */
	showLabel?: boolean;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Additional CSS classes for the container */
	className?: string;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Error message to display */
	error?: string;
	/** Whether to show the clock icon */
	showIcon?: boolean;
	/** Whether to use 12-hour format with AM/PM */
	hourCycle?: 12 | 24;
	/** Ref for the input element */
	ref?: React.Ref<HTMLInputElement>;
}

const TimeInput = ({
	value,
	onChange,
	label,
	showLabel = true,
	placeholder,
	className,
	disabled = false,
	required = false,
	error,
	showIcon = true,
	hourCycle = 12,
	ref,
	...props
}: TimeInputProps) => (
	<TimeField
		className={cn("*:not-first:mt-2", className)}
		hourCycle={hourCycle}
		onChange={(value) => {
			onChange?.(`${value?.hour}:${value?.minute}`);
		}}
		{...props}
	>
		{showLabel && label && (
			<Label
				className={cn(
					"text-foreground text-sm font-medium",
					required && "after:content-['*'] after:text-destructive after:ml-1",
					disabled && "opacity-50",
				)}
			>
				{label}
			</Label>
		)}
		<div className="relative">
			<DateInput
				className={cn(
					error &&
						"border-destructive focus:border-destructive focus:ring-destructive/50",
				)}
			/>
			{showIcon && (
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3">
					<ClockIcon size={16} aria-hidden="true" />
				</div>
			)}
		</div>
		{error && <p className="text-sm text-destructive mt-1">{error}</p>}
	</TimeField>
);

TimeInput.displayName = "TimeInput";

export { TimeInput, type TimeInputProps };
