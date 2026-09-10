"use client";

import {
    type ButtonHTMLAttributes,
    createContext,
    type HTMLAttributes,
    type MouseEvent,
    type ReactNode,
    type Ref,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import {
    bindDocumentKeyDown,
    cn,
    handleActivationKeyDown,
} from "@shared/utils";

// --- STYLES (CVA) ---

const dropdownTriggerVariants = cva(
    "cursor-pointer outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[#FE5F00]/40 focus-visible:ring-offset-2",
);

const dropdownContentVariants = cva(
    [
        "absolute z-50 mt-3 overflow-hidden rounded-2xl bg-white p-1.5",
        "shadow-2xl ring-1 ring-black/5",
        "animate-in fade-in zoom-in-95 duration-200",
    ],
    {
        variants: {
            align: {
                start: "left-0 origin-top-left",
                end: "right-0 origin-top-right",
            },
            size: {
                sm: "w-48",
                md: "w-64",
                lg: "w-80",
            },
        },
        defaultVariants: {
            align: "end",
            size: "md",
        },
    },
);

const dropdownItemVariants = cva(
    [
        "flex w-full cursor-pointer items-center rounded-xl px-3 py-2",
        "text-sm font-semibold text-gray-900 transition-colors duration-150",
        "outline-none focus-visible:bg-[#FE5F00]/5 focus-visible:text-[#FE5F00]",
    ],
    {
        variants: {
            tone: {
                default:
                    "hover:bg-[#FE5F00]/5 hover:text-[#FE5F00] active:bg-[#FE5F00]/10",
                danger:
                    "text-red-600 hover:bg-red-50 active:bg-red-100/80 focus-visible:text-red-600",
            },
        },
        defaultVariants: {
            tone: "default",
        },
    },
);

// --- TYPES ---

export type DropdownAlign = NonNullable<
    VariantProps<typeof dropdownContentVariants>["align"]
>;

export type DropdownSize = NonNullable<
    VariantProps<typeof dropdownContentVariants>["size"]
>;

export type DropdownItemTone = NonNullable<
    VariantProps<typeof dropdownItemVariants>["tone"]
>;

export type DropdownState = {
    isOpen: boolean;
};

type DropdownContextValue = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    closeOnSelect: boolean;
    menuId: string;
    triggerId: string;
};

export type DropdownRootProps = HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    children: ReactNode;
};

export type DropdownTriggerProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
> & {
    className?: ((state: DropdownState) => string | undefined) | string;
    ref?: Ref<HTMLButtonElement>;
    asChild?: boolean;
};

export type DropdownContentProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "className"
> & {
    className?: ((state: DropdownState) => string | undefined) | string;
    align?: DropdownAlign;
    size?: DropdownSize;
};

export type DropdownItemProps = HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    tone?: DropdownItemTone;
};

type DropdownClassName =
    | ((state: DropdownState) => string | undefined)
    | string;

const resolveDropdownClassName = (
    className: DropdownClassName | undefined,
    state: DropdownState,
) =>
    typeof className === "function" ? className(state) : className;

// --- CONTEXT ---

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error(
            "Sub-componentele Dropdown.* trebuie folosite în interiorul <Dropdown />.",
        );
    }
    return context;
};

// --- COMPONENT ---

/**
 * Rădăcină dropdown: stare deschis/închis, închidere la Escape și click în afară.
 */
const DropdownRoot = ({
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
    closeOnSelect = true,
    children,
    className,
    ...rest
}: DropdownRootProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const rootRef = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const triggerId = useId();
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) {
                setUncontrolledOpen(next);
            }
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );

    const open = useCallback(() => setOpen(true), [setOpen]);
    const close = useCallback(() => setOpen(false), [setOpen]);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: globalThis.MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        const unbindKeyDown = bindDocumentKeyDown({ onEscape: close });

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            unbindKeyDown();
        };
    }, [isOpen, close]);

    return (
        <DropdownContext.Provider
            value={{
                isOpen,
                open,
                close,
                toggle,
                closeOnSelect,
                menuId,
                triggerId,
            }}
        >
            <div
                ref={rootRef}
                className={cn("relative inline-block text-left", className)}
                {...rest}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

/**
 * Declanșatorul meniului (`button` sau `asChild` cu `Slot` pentru `Link` / `Button`).
 */
const DropdownTrigger = ({
    onClick,
    className,
    asChild,
    ref,
    ...rest
}: DropdownTriggerProps) => {
    const { toggle, isOpen, menuId, triggerId } = useDropdownContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggle();
    };

    const resolvedClassName = resolveDropdownClassName(className, { isOpen });
    const Component = asChild ? Slot : "button";

    return (
        <Component
            ref={ref}
            id={triggerId}
            type={asChild ? undefined : "button"}
            onClick={handleClick}
            className={cn(dropdownTriggerVariants(), resolvedClassName)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-controls={isOpen ? menuId : undefined}
            data-state={isOpen ? "open" : "closed"}
            {...rest}
        />
    );
};

/**
 * Panoul meniului. Randat doar când dropdown-ul este deschis.
 */
const DropdownContent = ({
    className,
    align,
    size,
    ...rest
}: DropdownContentProps) => {
    const { isOpen, menuId, triggerId } = useDropdownContext();

    if (!isOpen) return null;

    const resolvedClassName = resolveDropdownClassName(className, { isOpen });

    return (
        <div
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            className={cn(
                dropdownContentVariants({ align, size }),
                resolvedClassName,
            )}
            {...rest}
        />
    );
};

/**
 * Element de meniu. Închide dropdown-ul la click dacă `closeOnSelect` este activ.
 */
const DropdownItem = ({
    onClick,
    className,
    asChild,
    tone,
    ...rest
}: DropdownItemProps) => {
    const { closeOnSelect, close } = useDropdownContext();
    const Component = asChild ? Slot : "div";

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (closeOnSelect && !event.defaultPrevented) {
            close();
        }
    };

    return (
        <Component
            role="menuitem"
            tabIndex={0}
            className={cn(dropdownItemVariants({ tone }), className)}
            onClick={handleClick}
            onKeyDown={(event) => {
                handleActivationKeyDown(event, () => {
                    handleClick(
                        event as unknown as MouseEvent<HTMLDivElement>,
                    );
                });
            }}
            {...rest}
        />
    );
};

type DropdownCompound = typeof DropdownRoot & {
    Trigger: typeof DropdownTrigger;
    Content: typeof DropdownContent;
    Item: typeof DropdownItem;
};

DropdownRoot.displayName = "Dropdown";

/**
 * Meniu dropdown compus pentru App Router (Client Component).
 * @example
 * ```tsx
 * <Dropdown closeOnSelect>
 *   <Dropdown.Trigger asChild>
 *     <Button kind="outline">Contul meu</Button>
 *   </Dropdown.Trigger>
 *   <Dropdown.Content align="end" size="md">
 *     <Dropdown.Item onClick={handleLogout}>Deconectare</Dropdown.Item>
 *   </Dropdown.Content>
 * </Dropdown>
 * ```
 */
export const Dropdown = DropdownRoot as DropdownCompound;

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

DropdownTrigger.displayName = "Dropdown.Trigger";
DropdownContent.displayName = "Dropdown.Content";
DropdownItem.displayName = "Dropdown.Item";
