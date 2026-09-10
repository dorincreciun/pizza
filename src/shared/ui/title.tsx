import {
    createElement,
    type HTMLAttributes,
    type ReactNode,
} from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const titleVariants = cva("font-bold tracking-tight text-gray-900", {
    variants: {
        size: {
            xs: "text-[16px]",
            sm: "text-[22px]",
            md: "text-[26px]",
            lg: "text-[32px]",
            xl: "text-[36px] font-extrabold",
            "2xl": "text-[40px]",
        },
    },
    defaultVariants: {
        size: "xs",
    },
});

// --- TYPES ---

export type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TitleSize = NonNullable<VariantProps<typeof titleVariants>["size"]>;

export type TitleProps = {
    /** Tag semantic (h1–h6). Poate diferi de dimensiunea vizuală (`size`). */
    as: TitleTag;
    /** Dimensiune vizuală (xs–2xl). */
    size?: TitleSize;
    className?: string;
    children: ReactNode;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "className" | "children">;

// --- COMPONENT ---

/**
 * Titlu polimorfic: separă semantica HTML de stil. Fără `"use client"` — poate fi
 * randat în Server Components (pagini, layout-uri Next.js).
 *
 * @example
 * ```tsx
 * <Title as="h1" size="md">{t("title")}</Title>
 * ```
 *
 * @example
 * ```tsx
 * <Title as="h2" size="2xl" className="text-[#FE5F00]" id="promo-heading">
 *   Promovare specială
 * </Title>
 * ```
 */
export function Title({
    as,
    children,
    size,
    className,
    ...rest
}: TitleProps) {
    return createElement(
        as,
        {
            ...rest,
            className: cn(titleVariants({ size }), className),
        },
        children,
    );
}
