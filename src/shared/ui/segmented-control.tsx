"use client";

import {
    useCallback,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const segmentedRootVariants = cva(
    [
        "relative flex w-full items-center px-0.75",
        "rounded-2xl bg-[#F5F5F5]",
        "transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-[#FE5F00]/40 focus-within:ring-offset-2",
    ],
    {
        variants: {
            size: {
                sm: "h-9",
                md: "h-10",
            },
            disabled: {
                true: "cursor-not-allowed opacity-60",
                false: "",
            },
        },
        defaultVariants: {
            size: "md",
            disabled: false,
        },
    },
);

const segmentedThumbVariants = cva(
    [
        "absolute top-1/2 left-0 z-0 -translate-y-1/2",
        "rounded-xl bg-white shadow-sm",
        "transition-transform duration-300 ease-in-out will-change-transform",
    ],
    {
        variants: {
            size: {
                sm: "h-[calc(100%-4px)]",
                md: "h-[calc(100%-5px)]",
            },
        },
        defaultVariants: {
            size: "md",
        },
    },
);

const segmentedLabelVariants = cva(
    [
        "block w-full px-4 py-2",
        "text-center text-sm font-semibold tracking-tight",
        "transition-colors duration-300",
    ],
    {
        variants: {
            active: {
                true: "text-[#FE5F00]",
                false: "text-[#606060] hover:text-[#202020]",
            },
            disabled: {
                true: "cursor-not-allowed",
                false: "cursor-pointer",
            },
        },
        defaultVariants: {
            active: false,
            disabled: false,
        },
    },
);

// --- TYPES ---

/** O opțiune din segmented control. */
export type SegmentedControlOption = {
    /** Valoarea trimisă la `onChange`. */
    value: string;
    /** Textul afișat în UI. */
    label: string;
};

export type SegmentedControlProps = {
    /** Lista de opțiuni. */
    options: readonly SegmentedControlOption[];
    /** Valoare controlată (dacă e setată, componenta e controlată). */
    value?: string;
    /** Valoare inițială în mod necontrolat. */
    defaultValue?: string;
    /** Callback la schimbarea selecției. */
    onChange?: (value: string, index: number) => void;
    /** Atributul `name` pentru input-urile radio. */
    name?: string;
    className?: string;
} & VariantProps<typeof segmentedRootVariants>;

type SegmentedThumbProps = {
    thumbWidth: number;
    thumbX: number;
    size: NonNullable<VariantProps<typeof segmentedRootVariants>["size"]>;
};

// --- UTILS ---

function resolveActiveIndex(
    options: readonly SegmentedControlOption[],
    selectedValue: string | undefined,
): number {
    if (!options.length) return 0;
    if (selectedValue === undefined) return 0;

    const idx = options.findIndex((opt) => opt.value === selectedValue);
    return idx === -1 ? 0 : idx;
}

// --- INTERNAL ---

function SegmentedThumb({ thumbWidth, thumbX, size }: SegmentedThumbProps) {
    return (
        <div
            aria-hidden
            style={{
                transform: `translateX(${thumbX}px)`,
                width: `${thumbWidth}px`,
            }}
            className={segmentedThumbVariants({ size })}
        />
    );
}

// --- COMPONENT ---

/**
 * Segmented control cu indicator glisant animat (ResizeObserver).
 * Suportă mod controlat (`value`) și necontrolat (`defaultValue`).
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: "daily", label: "Zilnic" },
 *     { value: "monthly", label: "Lunar" },
 *   ]}
 *   value={period}
 *   onChange={(value) => setPeriod(value)}
 * />
 * ```
 */
export function SegmentedControl({
    options = [],
    value,
    defaultValue,
    onChange,
    name,
    disabled = false,
    size = "md",
    className,
}: SegmentedControlProps) {
    const rootId = useId();
    const groupName = name ?? `segmented-control-${rootId}`;
    const isDisabled = Boolean(disabled);

    const isControlled = value !== undefined;

    const [uncontrolledIndex, setUncontrolledIndex] = useState(() =>
        resolveActiveIndex(options, defaultValue),
    );

    const activeIndex = useMemo(() => {
        if (isControlled) {
            return resolveActiveIndex(options, value);
        }
        return uncontrolledIndex;
    }, [isControlled, options, value, uncontrolledIndex]);

    const [thumbWidth, setThumbWidth] = useState(0);
    const [thumbX, setThumbX] = useState(0);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const recalcThumb = useCallback(() => {
        const container = containerRef.current;
        const activeEl = optionRefs.current[activeIndex];

        if (!container || !activeEl) return;

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        setThumbWidth(activeRect.width);
        setThumbX(activeRect.left - containerRect.left);
    }, [activeIndex]);

    useLayoutEffect(() => {
        if (options.length === 0) return;

        recalcThumb();

        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(recalcThumb);
        observer.observe(container);

        return () => observer.disconnect();
    }, [recalcThumb, options.length]);

    const handleChange = (index: number) => {
        if (isDisabled) return;

        const selectedOption = options[index];
        if (!selectedOption) return;

        if (!isControlled) {
            setUncontrolledIndex(index);
        }

        onChange?.(selectedOption.value, index);
    };

    if (!options.length) return null;

    return (
        <div
            ref={containerRef}
            role="radiogroup"
            aria-disabled={isDisabled || undefined}
            className={cn(
                segmentedRootVariants({ size, disabled: isDisabled }),
                className,
            )}
        >
            <SegmentedThumb
                thumbWidth={thumbWidth}
                thumbX={thumbX}
                size={size ?? "md"}
            />

            {options.map((option, index) => {
                const inputId = `${rootId}-${option.value}`;
                const isActive = index === activeIndex;

                return (
                    <div
                        key={option.value}
                        ref={(el) => {
                            optionRefs.current[index] = el;
                        }}
                        className="relative z-10 flex-1"
                    >
                        <input
                            type="radio"
                            id={inputId}
                            name={groupName}
                            value={option.value}
                            checked={isActive}
                            disabled={isDisabled}
                            onChange={() => handleChange(index)}
                            className="peer sr-only"
                        />
                        <label
                            htmlFor={inputId}
                            className={segmentedLabelVariants({
                                active: isActive,
                                disabled: isDisabled,
                            })}
                        >
                            {option.label}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

SegmentedControl.displayName = "SegmentedControl";
