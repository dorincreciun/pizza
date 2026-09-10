"use client";

import {ComponentProps, HTMLAttributes, ReactNode, useEffect, useMemo} from "react";
import { createContext, useContext } from "react";
import { X } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Overlay } from "@shared/ui/overlay";
import { cn } from "@shared/utils";

// --- CONTEXT ---

interface SidebarContextProps {
    toggle: (state: boolean) => void;
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

interface SidebarProviderProps {
    children: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SidebarProvider = ({ children, open, onOpenChange }: SidebarProviderProps) => {
    const value = useMemo(
        () => ({
            isOpen: open,
            toggle: onOpenChange,
            open: () => onOpenChange(true),
            close: () => onOpenChange(false),
        }),
        [open, onOpenChange],
    );

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

// --- TYPES (COMPONENTS) ---

const sidebarDefaultClassName = "w-full max-w-[400px]";

export type SidebarRootProps = HTMLAttributes<HTMLDivElement> & {
    /** Stânga (default) sau dreapta. */
    side?: "left" | "right";
};

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

export type SidebarCloseProps = ComponentProps<typeof Button>;

export type SidebarBodyProps = HTMLAttributes<HTMLDivElement>;

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export type SidebarDividerProps = HTMLAttributes<HTMLDivElement>;

// --- COMPONENT ---

/**
 * Panoul principal al sidebar-ului (compound root).
 * Include overlay și ancorare stânga/dreapta; starea `open` se controlează din exterior (ex. Zustand).
 * @example
 * ```tsx
 * import { Sidebar, SidebarProvider } from "@shared/ui";
 * import { useStoreCart } from "@entities/cart";
 *
 * export function CartSidebar() {
 *   const open = useStoreCart((s) => s.open);
 *   const setOpen = useStoreCart((s) => s.setOpen);
 *
 *   return (
 *     <SidebarProvider open={open} onOpenChange={setOpen}>
 *       <Sidebar side="right">
 *         <Sidebar.Header>Coș</Sidebar.Header>
 *         <Sidebar.Close aria-label="Închide" />
 *         <Sidebar.Body>conținut</Sidebar.Body>
 *       </Sidebar>
 *     </SidebarProvider>
 *   );
 * }
 * ```
 */
const SidebarRoot = ({
    children,
    className,
    side = "left",
    ...rest
}: SidebarRootProps) => {
    const { isOpen, close } = useSidebar();

    const resolvedSidePos = side === "left" ? "left-0" : "right-0";
    const resolvedTranslate = side === "left" ? "-translate-x-full" : "translate-x-full";

    return (
        <>
            {isOpen && <Overlay onClick={close} className="z-40" />}

            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed inset-y-0 z-50 flex h-screen flex-col overflow-hidden bg-white shadow-xl",
                    "transition-transform duration-200 ease-out",
                    resolvedSidePos,
                    isOpen ? "translate-x-0" : resolvedTranslate,
                    sidebarDefaultClassName,
                    className,
                )}
                {...rest}
            >
                {children}
            </div>
        </>
    );
};

/**
 * Antetul sidebar-ului.
 * Spațiu rezervat (`pr-[3.75rem]`) pentru butonul de închidere.
 */
const SidebarHeader = ({ children, className, ...rest }: SidebarHeaderProps) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-between gap-4",
            "px-6 pt-6 pb-4 pr-[3.75rem]",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Buton de închidere pentru sidebar.
 */
const SidebarClose = ({
    className,
    children,
    onClick,
    onlyIcon,
    type = "button",
    kind = "ghost",
    size = "sm",
    ...rest
}: SidebarCloseProps & { onlyIcon?: boolean }) => {
    const { close } = useSidebar();
    const hasCustomChildren = children !== undefined;
    const resolvedOnlyIcon = onlyIcon ?? !hasCustomChildren;

    return (
        <Button
            type={type}
            kind={kind}
            size={size}
            className={cn(
                "absolute right-6 top-6 z-10 !size-9 shrink-0",
                className,
            )}
            onlyIcon={resolvedOnlyIcon}
            onClick={(event) => {
                onClick?.(event);
                close();
            }}
            {...rest}
        >
            {children ?? <X aria-hidden />}
        </Button>
    );
};

/**
 * Corpul sidebar-ului, cu scroll vertical când e cazul.
 */
const SidebarBody = ({ className, children, ...rest }: SidebarBodyProps) => (
    <div
        className={cn(
            "flex min-h-0 flex-1 flex-col items-stretch overflow-y-auto",
            "px-6 pb-6",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Subsolul sidebar-ului pentru acțiuni.
 */
const SidebarFooter = ({
    className,
    children,
    ...rest
}: SidebarFooterProps) => (
    <div
        className={cn(
            "flex shrink-0 items-center justify-end gap-3",
            "border-t border-gray-200 px-6 py-4",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Separator orizontal între secțiuni din interiorul sidebar-ului.
 */
const SidebarDivider = ({ className, ...rest }: SidebarDividerProps) => (
    <div
        role="separator"
        className={cn("mx-6 border-t border-gray-200", className)}
        {...rest}
    />
);

type SidebarCompound = typeof SidebarRoot & {
    Header: typeof SidebarHeader;
    Close: typeof SidebarClose;
    Body: typeof SidebarBody;
    Footer: typeof SidebarFooter;
    Divider: typeof SidebarDivider;
};

SidebarRoot.displayName = "Sidebar";

export const Sidebar = SidebarRoot as SidebarCompound;

Sidebar.Header = SidebarHeader;
Sidebar.Close = SidebarClose;
Sidebar.Body = SidebarBody;
Sidebar.Footer = SidebarFooter;
Sidebar.Divider = SidebarDivider;