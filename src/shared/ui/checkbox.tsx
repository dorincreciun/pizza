"use client";

import {
    createContext,
    forwardRef,
    type InputHTMLAttributes,
    type LabelHTMLAttributes,
    type ReactNode,
    useContext,
    useId,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@shared/utils";

// ───── STYLES (CVA) ─────────────────────────────────────────────────────────

const controlVariants = cva(
    "relative shrink-0 overflow-hidden rounded-lg",
    {
        variants: {
            size: {
                sm: "size-5",
                md: "size-6",
                lg: "size-7",
            },
        },
        defaultVariants: { size: "md" },
    },
);

const indicatorVariants = cva(
    [
        "absolute inset-0 flex items-center justify-center",
        "bg-[#F1F1F1] transition-all duration-200",
        "peer-checked:bg-[#FE5F00]",
        "peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-[#FE5F00]/40 peer-focus-visible:ring-offset-2",
    ],
    {
        variants: {
            status: {
                default: "",
                error: [
                    "bg-red-50/80",
                    "peer-checked:bg-red-500",
                    "peer-focus-visible:ring-red-500/40",
                ],
                disabled: "cursor-not-allowed opacity-60",
            },
        },
        defaultVariants: { status: "default" },
    },
);

const iconVariants = cva(
    "scale-90 text-white opacity-0 transition-all duration-200",
    {
        variants: {
            size: {
                sm: "size-3.5",
                md: "size-4",
                lg: "size-5",
            },
        },
        defaultVariants: { size: "md" },
    },
);

// ───── TYPES ────────────────────────────────────────────────────────────────

export type CheckboxStatus = "default" | "error" | "disabled";
export type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxContextValue {
    id: string;
    status: CheckboxStatus;
    size: CheckboxSize;
    isDisabled: boolean;
    helperId: string;
}

const labelStatusClass: Record<CheckboxStatus, string> = {
    default: "text-gray-700",
    error: "text-red-600",
    disabled: "cursor-not-allowed text-gray-400",
};

const helperStatusClass: Record<CheckboxStatus, string> = {
    default: "text-gray-400",
    error: "font-medium text-red-500",
    disabled: "text-gray-300",
};

// ───── CONTEXT ──────────────────────────────────────────────────────────────

const CheckboxContext = createContext<CheckboxContextValue | null>(null);

const useCheckboxContext = (subComponent: string) => {
    const context = useContext(CheckboxContext);
    if (!context) {
        throw new Error(
            `<Checkbox.${subComponent}> trebuie folosit in interiorul <Checkbox>.`,
        );
    }
    return context;
};

// ───── SUB-COMPONENTS ───────────────────────────────────────────────────────

export interface CheckboxRootProps {
    id?: string;
    name?: string;
    status?: CheckboxStatus;
    size?: CheckboxSize;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
}

function CheckboxRoot({
    id: externalId,
    status = "default",
    size = "md",
    disabled,
    className,
    children,
}: CheckboxRootProps) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const isDisabled = status === "disabled" || Boolean(disabled);
    const visualStatus: CheckboxStatus = isDisabled ? "disabled" : status;

    const contextValue: CheckboxContextValue = {
        id,
        status: visualStatus,
        size,
        isDisabled,
        helperId: `${id}-helper`,
    };

    return (
        <CheckboxContext.Provider value={contextValue}>
            <label
                htmlFor={id}
                className={cn(
                    "inline-flex items-center gap-2 select-none",
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                    className,
                )}
            >
                {children}
            </label>
        </CheckboxContext.Provider>
    );
}

export type CheckboxFieldProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "id" | "size"
> &
    VariantProps<typeof controlVariants>;

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
    function CheckboxField({ className, size: sizeProp, ...props }, ref) {
        const { id, status, size, isDisabled, helperId } =
            useCheckboxContext("Field");

        return (
            <span className={controlVariants({ size: sizeProp ?? size })}>
                <input
                    {...props}
                    ref={ref}
                    id={id}
                    type="checkbox"
                    disabled={isDisabled}
                    aria-invalid={status === "error" || undefined}
                    aria-describedby={helperId}
                    className={cn("peer sr-only", className)}
                />
                <span
                    aria-hidden
                    className={indicatorVariants({ status })}
                >
                    <Check
                        strokeWidth={3}
                        className={iconVariants({ size: sizeProp ?? size })}
                    />
                </span>
            </span>
        );
    },
);

export type CheckboxLabelProps = Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    "htmlFor"
>;

function CheckboxLabel({ className, ...props }: CheckboxLabelProps) {
    const { status } = useCheckboxContext("Label");

    return (
        <span
            {...props}
            className={cn(
                "text-base font-normal transition-colors duration-300",
                labelStatusClass[status],
                className,
            )}
        />
    );
}

export interface CheckboxHelperProps {
    children?: ReactNode;
    className?: string;
}

function CheckboxHelper({ children, className }: CheckboxHelperProps) {
    const { status, helperId } = useCheckboxContext("Helper");

    if (!children) return null;

    return (
        <p
            id={helperId}
            role={status === "error" ? "alert" : "status"}
            className={cn(
                "mt-1.5 ml-8 text-[11px] transition-all duration-300",
                helperStatusClass[status],
                className,
            )}
        >
            {children}
        </p>
    );
}

export interface CheckboxGroupProps {
    children: ReactNode;
    className?: string;
}

function CheckboxGroup({ children, className }: CheckboxGroupProps) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    );
}

const skeletonSizeClass: Record<CheckboxSize, string> = {
    sm: "size-5",
    md: "size-6",
    lg: "size-7",
};

export interface CheckboxGroupSkeletonProps {
    count?: number;
    size?: CheckboxSize;
    className?: string;
}

function CheckboxGroupSkeleton({
    count = 3,
    size = "md",
    className,
}: CheckboxGroupSkeletonProps) {
    return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="inline-flex items-center gap-2 select-none"
                >
                    <span
                        className={cn(
                            "shrink-0 animate-pulse rounded-lg bg-gray-200",
                            skeletonSizeClass[size],
                        )}
                    />
                    <span className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
                </div>
            ))}
        </div>
    );
}

// ───── COMPOUND EXPORT ──────────────────────────────────────────────────────
// Object.assign atașează sub-componentele într-o singură expresie. Spre deosebire
// de mutația individuală (`Checkbox.Field = Field`), aceasta nu se sparge la
// HMR / Turbopack când modulul este re-evaluat.

/**
 * Checkbox compus. Sub-componentele necesită parintele `<Checkbox>` (context).
 * `<Checkbox.Group>` este wrapper safe pentru mai multe checkbox-uri.
 *
 * @example
 * <Checkbox.Group>
 *   {items.map((item) => (
 *     <Checkbox key={item.id} name={item.id}>
 *       <Checkbox.Field />
 *       <Checkbox.Label>{item.name}</Checkbox.Label>
 *     </Checkbox>
 *   ))}
 * </Checkbox.Group>
 */
export const Checkbox = Object.assign(CheckboxRoot, {
    Field: CheckboxField,
    Label: CheckboxLabel,
    Helper: CheckboxHelper,
    Group: CheckboxGroup,
    GroupSkeleton: CheckboxGroupSkeleton,
});
