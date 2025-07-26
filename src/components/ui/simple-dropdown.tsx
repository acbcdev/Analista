import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
	id: string;
	name: string;
	items: { length: number };
}

interface SimpleDropdownProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	items: MenuItem[];
	disabled?: boolean;
	className?: string;
}

export function SimpleDropdown({
	value,
	onValueChange,
	placeholder,
	items,
	disabled = false,
	className = "",
}: SimpleDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedItem = items.find((item) => item.id === value);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	const handleSelect = (itemId: string) => {
		onValueChange(itemId);
		setIsOpen(false);
	};

	return (
		<div className={cn("relative", className)} ref={dropdownRef}>
			<Button
				type="button"
				variant="outline"
				className="w-full h-8 text-xs justify-between font-normal"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span
					className={cn(
						"truncate text-left",
						!selectedItem && "text-muted-foreground",
					)}
				>
					{selectedItem
						? `${selectedItem.name} (${selectedItem.items.length} items)`
						: placeholder}
				</span>
				<ChevronDown
					className={cn(
						"h-3 w-3 opacity-50 transition-transform shrink-0",
						isOpen && "rotate-180",
					)}
				/>
			</Button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
					{items.length === 0 ? (
						<div className="px-2 py-1.5 text-xs text-muted-foreground">
							No active menus available
						</div>
					) : (
						<div className="p-1">
							{items.map((item) => (
								<button
									key={item.id}
									type="button"
									className={cn(
										"relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors",
										"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
										value === item.id && "bg-accent text-accent-foreground",
									)}
									onClick={() => handleSelect(item.id)}
								>
									<span className="truncate">
										{item.name} ({item.items.length} items)
									</span>
									{value === item.id && (
										<Check className="h-3 w-3 ml-auto shrink-0" />
									)}
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
