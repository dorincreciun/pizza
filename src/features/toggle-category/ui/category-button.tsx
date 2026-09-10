import {cn} from "@shared/utils";
import {ComponentProps, ReactNode} from "react";

interface CategoryButtonProps extends ComponentProps<'button'> {
    isActive: boolean
    children: ReactNode
    /** `fill` = lățimi egale în bară; `auto` = lățime după conținut (PriorityNavigation). */
    layout?: "fill" | "auto"
}

export const CategoryButton = ({
    isActive,
    children,
    layout = "auto",
    className,
    ...rest
}: CategoryButtonProps) => {
    return (
        <button
            type="button"
            className={cn(
                // Layout & Sizing
                "flex h-full shrink-0 items-center justify-center",
                layout === "fill" ? "flex-1" : "flex-none",

                // Spacing & Shape
                "rounded-2xl px-6",

                // Typography
                "text-center text-base font-medium text-nowrap",

                // Transitions & Interactivity
                "cursor-pointer transition-all duration-300 ease-out",

                // Conditional Styles
                isActive
                    ? "bg-white text-[#FE5F00] shadow-[0_14px_20px_rgba(0,0,0,0.05)]"
                    : "text-[#202020] hover:text-[#FE5F00]",
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    )
};