import type { HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const skeletonBoneClass = "rounded-md bg-gray-200";

const productCardSkeletonMediaVariants = cva(
    [
        "relative flex items-center justify-center overflow-hidden rounded-2xl",
        "bg-gray-50 p-5",
    ],
    {
        variants: {
            aspect: {
                square: "aspect-square",
                video: "aspect-video",
                auto: "",
            },
        },
        defaultVariants: {
            aspect: "auto",
        },
    },
);

// --- TYPES ---

export type ProductCardSkeletonRootProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardSkeletonMediaProps = HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof productCardSkeletonMediaVariants>;

export type ProductCardSkeletonContentProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardSkeletonTitleProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardSkeletonDescriptionProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardSkeletonFooterProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardSkeletonListProps = {
    count?: number;
    className?: string;
};

// --- COMPONENT ---

/**
 * Container skeleton — aceeași structură ca `ProductCard`.
 */
const ProductCardSkeletonRoot = ({
    className,
    children,
    ...rest
}: ProductCardSkeletonRootProps) => (
    <div
        aria-hidden
        className={cn(
            "relative flex w-full animate-pulse flex-col",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Placeholder media (zonă imagine).
 */
const ProductCardSkeletonMedia = ({
    className,
    aspect,
    children,
    ...rest
}: ProductCardSkeletonMediaProps) => (
    <div
        className={cn(
            productCardSkeletonMediaVariants({ aspect }),
            className,
        )}
        {...rest}
    >
        {children ?? (
            <div
                className={cn(
                    "size-36 shrink-0 rounded-full",
                    skeletonBoneClass,
                )}
            />
        )}
    </div>
);

/**
 * Bloc conținut (`py-3.5` ca `ProductCard.Content`).
 */
const ProductCardSkeletonContent = ({
    className,
    children,
    ...rest
}: ProductCardSkeletonContentProps) => (
    <div className={cn("flex-1 py-3.5", className)} {...rest}>
        {children}
    </div>
);

/**
 * Placeholder titlu (~ `text-xl`).
 */
const ProductCardSkeletonTitle = ({
    className,
    ...rest
}: ProductCardSkeletonTitleProps) => (
    <div
        className={cn("mb-2 h-7 w-3/4", skeletonBoneClass, className)}
        {...rest}
    />
);

/**
 * Placeholder descriere (2 rânduri, ~ `line-clamp-2`).
 */
const ProductCardSkeletonDescription = ({
    className,
    ...rest
}: ProductCardSkeletonDescriptionProps) => (
    <div className={cn("space-y-2", className)} {...rest}>
        <div className={cn("h-4 w-full", skeletonBoneClass)} />
        <div className={cn("h-4 w-5/6", skeletonBoneClass)} />
    </div>
);

/**
 * Placeholder footer (preț + buton).
 */
const ProductCardSkeletonFooter = ({
    className,
    children,
    ...rest
}: ProductCardSkeletonFooterProps) => (
    <div
        className={cn(
            "mt-auto flex items-center justify-between gap-3 pt-2",
            className,
        )}
        {...rest}
    >
        {children ?? (
            <>
                <div className={cn("h-6 w-16", skeletonBoneClass)} />
                <div
                    className={cn("h-10 w-28 rounded-xl", skeletonBoneClass)}
                />
            </>
        )}
    </div>
);

type ProductCardSkeletonCompound = typeof ProductCardSkeletonRoot & {
    Media: typeof ProductCardSkeletonMedia;
    Content: typeof ProductCardSkeletonContent;
    Title: typeof ProductCardSkeletonTitle;
    Description: typeof ProductCardSkeletonDescription;
    Footer: typeof ProductCardSkeletonFooter;
};

ProductCardSkeletonRoot.displayName = "ProductCardSkeleton";

/**
 * Skeleton compus pentru card produs (oglindă `ProductCard`).
 * @example
 * ```tsx
 * <ProductCardSkeleton>
 *   <ProductCardSkeleton.Media />
 *   <ProductCardSkeleton.Content>
 *     <ProductCardSkeleton.Title />
 *     <ProductCardSkeleton.Description />
 *   </ProductCardSkeleton.Content>
 *   <ProductCardSkeleton.Footer />
 * </ProductCardSkeleton>
 * ```
 */
export const ProductCardSkeleton =
    ProductCardSkeletonRoot as ProductCardSkeletonCompound;

ProductCardSkeleton.Media = ProductCardSkeletonMedia;
ProductCardSkeleton.Content = ProductCardSkeletonContent;
ProductCardSkeleton.Title = ProductCardSkeletonTitle;
ProductCardSkeleton.Description = ProductCardSkeletonDescription;
ProductCardSkeleton.Footer = ProductCardSkeletonFooter;

ProductCardSkeletonMedia.displayName = "ProductCardSkeleton.Media";
ProductCardSkeletonContent.displayName = "ProductCardSkeleton.Content";
ProductCardSkeletonTitle.displayName = "ProductCardSkeleton.Title";
ProductCardSkeletonDescription.displayName =
    "ProductCardSkeleton.Description";
ProductCardSkeletonFooter.displayName = "ProductCardSkeleton.Footer";

/**
 * Randează `count` carduri skeleton cu structura implicită completă.
 */
export const ProductCardSkeletonList = ({
    count = 1,
    className,
}: ProductCardSkeletonListProps) =>
    Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} className={className}>
            <ProductCardSkeleton.Media />
            <ProductCardSkeleton.Content>
                <ProductCardSkeleton.Title />
                <ProductCardSkeleton.Description />
            </ProductCardSkeleton.Content>
            <ProductCardSkeleton.Footer />
        </ProductCardSkeleton>
    ));
