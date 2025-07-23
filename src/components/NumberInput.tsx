import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import {
	Button,
	Group,
	Input,
	Label,
	NumberField,
} from "react-aria-components";
import { cn } from "@/lib/utils";

interface NumberInputProps {
	/** Current number value */
	value?: number;
	/** Callback when number changes */
	onChange?: (value: number) => void;
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
	/** Minimum value allowed */
	minValue?: number;
	/** Maximum value allowed */
	maxValue?: number;
	/** Step increment/decrement value */
	step?: number;
	/** Format options for number display */
	formatOptions?: Intl.NumberFormatOptions;
	/** Whether to show increment/decrement buttons */
	showButtons?: boolean;
	/** ID for the input element */
	id?: string;
	/** Whether to show the React Aria credit */
	showCredit?: boolean;
	/** Ref for the input element */
	ref?: React.Ref<HTMLInputElement>;
}

const NumberInput = ({
	value,
	onChange,
	label,
	showLabel = true,
	placeholder,
	className,
	disabled = false,
	required = false,
	error,
	minValue,
	maxValue,
	step = 1,
	formatOptions,
	showButtons = true,
	id,
	ref,
	...props
}: NumberInputProps) => {
	return (
		<NumberField
			value={value}
			onChange={onChange}
			minValue={minValue}
			maxValue={maxValue}
			step={step}
			formatOptions={formatOptions}
			isDisabled={disabled}
			isRequired={required}
			isInvalid={!!error}
			id={id}
			{...props}
		>
			<div className={cn("w-full space-y-2", className)}>
				{showLabel && label && (
					<Label
						className={cn(
							"text-foreground text-sm font-medium",
							required &&
								"after:content-['*'] after:text-destructive after:ml-1",
							disabled && "opacity-50",
						)}
					>
						{label}
					</Label>
				)}
				<Group
					className={cn(
						"border-input data-focus-within:border-ring relative flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50",
						error && "border-destructive focus-within:border-destructive",
					)}
				>
					<Input
						ref={ref}
						placeholder={placeholder}
						className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums outline-none focus:outline-none"
					/>
					{showButtons && (
						<div className="flex h-[calc(100%+2px)] flex-col">
							<Button
								slot="increment"
								className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 outline-none focus:outline-none"
							>
								<ChevronUpIcon size={12} aria-hidden="true" />
							</Button>
							<Button
								slot="decrement"
								className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 outline-none focus:outline-none"
							>
								<ChevronDownIcon size={12} aria-hidden="true" />
							</Button>
						</div>
					)}
				</Group>
				{error && <p className="text-sm text-destructive mt-1">{error}</p>}
			</div>
		</NumberField>
	);
};

NumberInput.displayName = "NumberInput";

export { NumberInput, type NumberInputProps };

// Ejemplo de uso del componente controlado
export default function Component() {
	const [quantity, setQuantity] = useState(0);
	const [price, setPrice] = useState(100);
	const [views, setViews] = useState(1000);

	return (
		<div className="space-y-6">
			{/* Ejemplo en grid de 3 columnas */}
			<div className="grid grid-cols-3 gap-4">
				<NumberInput
					label="Views"
					value={views}
					onChange={setViews}
					minValue={0}
					step={1}
					required
				/>

				<NumberInput
					label="Tokens"
					value={quantity}
					onChange={setQuantity}
					minValue={0}
					maxValue={100}
					step={1}
				/>

				<NumberInput
					label="Privates"
					value={price}
					onChange={setPrice}
					minValue={0}
					step={1}
				/>
			</div>

			{/* Ejemplos individuales */}
			<div className="space-y-4">
				<NumberInput
					label="Price"
					value={price}
					onChange={setPrice}
					minValue={0}
					step={0.01}
					formatOptions={{
						style: "currency",
						currency: "USD",
					}}
				/>

				<NumberInput
					label="Simple Number"
					value={quantity}
					onChange={setQuantity}
					showButtons={false}
					showLabel={false}
					placeholder="Enter a number"
				/>
			</div>
		</div>
	);
}
