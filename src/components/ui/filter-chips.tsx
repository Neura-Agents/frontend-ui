import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterChipsProps<T extends string> {
    /** Array of available options */
    options: T[] | readonly T[];
    /** The currently selected value */
    value: T;
    /** Callback when a chip is clicked */
    onChange: (value: T) => void;
    /** Optional container className */
    className?: string;
    /** Optional chip className */
    chipClassName?: string;
}

/**
 * A reusable Filter Chips component for selection/filtering UI.
 * Commonly used for categories, tags, or simple toggles.
 */
function FilterChips<T extends string>({
    options,
    value,
    onChange,
    className,
    chipClassName
}: FilterChipsProps<T>) {
    return (
        <div className={cn("flex flex-wrap gap-2 pb-2", className)}>
            {options.map((option) => (
                <Button
                    key={option}
                    variant={value === option ? "default" : "outline"}
                    size="sm"
                    className={cn(
                        "rounded-full px-4 h-8 text-[11px] font-medium transition-all duration-300",
                        value === option
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/30 border-border hover:border-primary/30 hover:bg-card/50",
                        chipClassName
                    )}
                    onClick={() => onChange(option)}
                >
                    {option}
                </Button>
            ))}
        </div>
    );
}

export default FilterChips;
