"use client"

import {
    createContext,
    type InputHTMLAttributes,
    type LabelHTMLAttributes,
    type ReactNode,
    useContext,
    useId,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const inputControlVariants = cva(
    [
        "flex w-full items-center overflow-hidden",
        "rounded-xl border outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    ],
    {
        variants: {
            variant: {
                primary: "border-black/[0.06] bg-[#FAFAFA] focus-within:bg-white",
                secondary: "border-black/[0.08] bg-white",
            },
            size: {
                sm: "h-10 gap-2 px-3 text-sm",
                md: "h-12 gap-3 px-4 text-base",
                lg: "h-14 gap-3 px-5 text-lg",
            },
            status: {
                default: [
                    "focus-within:border-[#FE5F00]/40 focus-within:ring-1 focus-within:ring-[#FE5F00]/40",
                    "focus-within:shadow-[0_0_0_4px_rgba(254,95,0,0.04)]",
                ],
                error: [
                    "border-red-500/30 bg-red-50/20",
                    "focus-within:border-red-500/40 focus-within:ring-1 focus-within:ring-red-500/40",
                    "focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.06)]",
                ],
                success: [
                    "border-emerald-500/30 bg-emerald-50/20",
                    "focus-within:ring-1 focus-within:ring-emerald-500/40",
                    "focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.06)]",
                ],
                disabled: [
                    "cursor-not-allowed border-gray-200/50 bg-gray-100/80 opacity-60 shadow-none select-none",
                ],
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            status: "default",
        },
    },
);

// --- TYPES ---

export type InputStatus = "default" | "error" | "success" | "disabled";

type InputContextValue = {
    id: string;
    status: InputStatus;
};

export type InputRootProps = {
    id?: string;
    status?: InputStatus;
    children: ReactNode;
    className?: string;
};

export type InputLabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export type InputControlProps = {
    children: ReactNode;
    className?: string;
} & VariantProps<typeof inputControlVariants>;

export type InputAdornmentProps = {
    children: ReactNode;
    className?: string;
};

export type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export type InputHelperProps = {
    children?: ReactNode;
    className?: string;
};

const labelStatusClass: Record<InputStatus, string> = {
    default: "text-gray-700",
    error: "text-red-600",
    success: "text-emerald-700",
    disabled: "text-gray-400 cursor-not-allowed",
};

const helperStatusClass: Record<InputStatus, string> = {
    default: "text-gray-400",
    error: "text-red-500 font-medium",
    success: "text-emerald-600 font-medium",
    disabled: "text-gray-300",
};

// --- CONTEXT ---

const InputContext = createContext<InputContextValue | null>(null);

const useInputFieldContext = () => {
    const context = useContext(InputContext);
    if (!context) {
        throw new Error(
            "Sub-componentele Input.* trebuie folosite în interiorul <Input />.",
        );
    }
    return context;
};

// --- COMPONENT ---

/**
 * Container pentru un câmp de formular. Leagă Label, Control, Field și Helper.
 * Starea vizuală se controlează prin prop-ul `status`.
 */
const InputRoot = ({
    id: externalId,
    status = "default",
    children,
    className,
}: InputRootProps) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    return (
        <InputContext.Provider value={{ id, status }}>
            <div className={cn("group/field flex w-full flex-col", className)}>
                {children}
            </div>
        </InputContext.Provider>
    );
};

/**
 * Eticheta câmpului, legată de input prin `htmlFor` / `id`.
 */
const InputLabel = ({ className, ...props }: InputLabelProps) => {
    const { id, status } = useInputFieldContext();

    return (
        <label
            htmlFor={id}
            className={cn(
                "mb-1.5 ml-1 block text-sm font-medium transition-colors duration-300",
                labelStatusClass[status],
                className,
            )}
            {...props}
        />
    );
};

/**
 * Wrapper vizual al input-ului (border, focus, dimensiune).
 */
const InputControl = ({
    children,
    variant,
    size,
    className,
}: InputControlProps) => {
    const { status } = useInputFieldContext();

    return (
        <div
            className={cn(
                inputControlVariants({ variant, size, status }),
                className,
            )}
        >
            {children}
        </div>
    );
};

/**
 * Iconiță sau text auxiliar în interiorul Control (prefix / suffix).
 */
const InputAdornment = ({ children, className }: InputAdornmentProps) => (
    <div
        className={cn(
            "flex shrink-0 select-none items-center justify-center px-2 text-gray-400",
            className,
        )}
    >
        {children}
    </div>
);

/**
 * Elementul `<input>` nativ. Primește toate atributele HTML standard (`name`, `value`, `onChange`, etc.).
 */
const InputField = ({ className, disabled, ...props }: InputFieldProps) => {
    const { id, status } = useInputFieldContext();
    const isDisabled = status === "disabled" || disabled;

    return (
        <input
            {...props}
            id={id}
            disabled={isDisabled}
            aria-invalid={status === "error" || undefined}
            aria-describedby={`${id}-helper`}
            className={cn(
                "h-full w-full border-none bg-transparent px-0 font-light tracking-tight text-gray-700 outline-none placeholder:text-gray-300 focus:ring-0",
                isDisabled && "pointer-events-none cursor-not-allowed",
                className,
            )}
        />
    );
};

/**
 * Mesaj de ajutor sau eroare afișat sub câmp.
 */
const InputHelper = ({ children, className }: InputHelperProps) => {
    const { id, status } = useInputFieldContext();

    if (!children) return null;

    return (
        <p
            id={`${id}-helper`}
            role={status === "error" ? "alert" : "status"}
            className={cn(
                "mt-1.5 ml-1 text-[11px] transition-all duration-300",
                helperStatusClass[status],
                className,
            )}
        >
            {children}
        </p>
    );
};

type InputCompound = typeof InputRoot & {
    Label: typeof InputLabel;
    Control: typeof InputControl;
    Adornment: typeof InputAdornment;
    Field: typeof InputField;
    Helper: typeof InputHelper;
    /** @deprecated Folosește `Input.Adornment` */
    Slot: typeof InputAdornment;
};

InputRoot.displayName = "Input";

/**
 * Câmp compus pentru formulare controlate manual sau cu Server Actions.
 * @example
 * ```tsx
 * <Input status={hasError ? "error" : "default"}>
 *   <Input.Label>Email</Input.Label>
 *   <Input.Control>
 *     <Input.Field
 *       name="email"
 *       type="email"
 *       placeholder="you@example.com"
 *       value={email}
 *       onChange={(e) => setEmail(e.target.value)}
 *     />
 *   </Input.Control>
 *   {hasError && <Input.Helper>Email invalid</Input.Helper>}
 * </Input>
 * ```
 */
export const Input = InputRoot as InputCompound;

Input.Label = InputLabel;
Input.Control = InputControl;
Input.Adornment = InputAdornment;
Input.Field = InputField;
Input.Helper = InputHelper;
Input.Slot = InputAdornment;
