import type { HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const productCardCartMediaVariants = cva(
    [
        "flex shrink-0 items-center justify-center overflow-hidden rounded-xl",
        "bg-[#FE5F00]/5 p-1.5",
    ],
    {
        variants: {
            aspect: {
                square: "aspect-square",
                video: "aspect-video",
                auto: "",
            },
            size: {
                sm: "h-[4.25rem] w-[4.25rem]",
                md: "h-[4.75rem] w-[4.75rem]",
                lg: "h-20 w-20",
            },
        },
        defaultVariants: {
            aspect: "square",
            size: "md",
        },
    },
);

// --- TYPES ---

export type ProductCardCartRootProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardCartMediaProps = HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof productCardCartMediaVariants>;

export type ProductCardCartContentProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardCartDetailsProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardCartTitleProps = HTMLAttributes<HTMLHeadingElement>;

export type ProductCardCartDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type ProductCardCartFooterProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardCartActionsProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardCartPriceProps = HTMLAttributes<HTMLDivElement>;

// --- COMPONENT ---

/**
 * Container card produs în coș (layout orizontal).
 */
const ProductCardCartRoot = ({
    className,
    children,
    ...rest
}: ProductCardCartRootProps) => (
    <div
        className={cn(
            "flex items-start gap-3.5 rounded-xl border border-gray-100 bg-white p-3.5",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Zona media (imagine produs).
 */
const ProductCardCartMedia = ({
    className,
    aspect,
    size,
    children,
    ...rest
}: ProductCardCartMediaProps) => (
    <div
        className={cn(productCardCartMediaVariants({ aspect, size }), className)}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Coloana de conținut (titlu, descriere, acțiuni).
 */
const ProductCardCartContent = ({
    className,
    children,
    ...rest
}: ProductCardCartContentProps) => (
    <div className={cn("min-w-0 flex-1", className)} {...rest}>
        {children}
    </div>
);

/**
 * Bloc titlu + descriere, separat vizual prin bordură.
 */
const ProductCardCartDetails = ({
    className,
    children,
    ...rest
}: ProductCardCartDetailsProps) => (
    <div
        className={cn("mb-2.5 border-b border-gray-100 pb-2.5", className)}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Titlul produsului din coș.
 */
const ProductCardCartTitle = ({
    className,
    children,
    ...rest
}: ProductCardCartTitleProps) => (
    <h3
        className={cn(
            "line-clamp-2 text-base leading-snug font-bold text-gray-900",
            className,
        )}
        {...rest}
    >
        {children}
    </h3>
);

/**
 * Descriere / variantă produs în coș.
 */
const ProductCardCartDescription = ({
    className,
    children,
    ...rest
}: ProductCardCartDescriptionProps) => (
    <p className={cn("mt-0.5 text-xs leading-4 text-gray-500", className)} {...rest}>
        {children}
    </p>
);

/**
 * Rând inferior: acțiuni (cantitate) + preț.
 */
const ProductCardCartFooter = ({
    className,
    children,
    ...rest
}: ProductCardCartFooterProps) => (
    <div
        className={cn("flex items-center justify-between gap-2", className)}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Slot pentru controale (cantitate, ștergere etc.).
 */
const ProductCardCartActions = ({
    className,
    children,
    ...rest
}: ProductCardCartActionsProps) => (
    <div className={cn("flex min-w-0 items-center", className)} {...rest}>
        {children}
    </div>
);

/**
 * Prețul liniei din coș.
 */
const ProductCardCartPrice = ({
    className,
    children,
    ...rest
}: ProductCardCartPriceProps) => (
    <div
        className={cn("shrink-0 text-sm font-bold text-gray-900 tabular-nums", className)}
        {...rest}
    >
        {children}
    </div>
);

type ProductCardCartCompound = typeof ProductCardCartRoot & {
    Media: typeof ProductCardCartMedia;
    Content: typeof ProductCardCartContent;
    Details: typeof ProductCardCartDetails;
    Title: typeof ProductCardCartTitle;
    Description: typeof ProductCardCartDescription;
    Footer: typeof ProductCardCartFooter;
    Actions: typeof ProductCardCartActions;
    Price: typeof ProductCardCartPrice;
};

ProductCardCartRoot.displayName = "ProductCardCart";

/**
 * Card produs compus pentru coș.
 * @example
 * ```tsx
 * <ProductCardCart>
 *   <ProductCardCart.Media>
 *     <Image src={imageUrl} alt="" width={96} height={96} className="aspect-square object-contain" />
 *   </ProductCardCart.Media>
 *   <ProductCardCart.Content>
 *     <ProductCardCart.Details>
 *       <ProductCardCart.Title>{name}</ProductCardCart.Title>
 *       <ProductCardCart.Description>{variantLabel}</ProductCardCart.Description>
 *     </ProductCardCart.Details>
 *     <ProductCardCart.Footer>
 *       <ProductCardCart.Actions>
 *         <QuantityControls />
 *       </ProductCardCart.Actions>
 *       <ProductCardCart.Price>{price}</ProductCardCart.Price>
 *     </ProductCardCart.Footer>
 *   </ProductCardCart.Content>
 * </ProductCardCart>
 * ```
 */
export const ProductCardCart = ProductCardCartRoot as ProductCardCartCompound;

ProductCardCart.Media = ProductCardCartMedia;
ProductCardCart.Content = ProductCardCartContent;
ProductCardCart.Details = ProductCardCartDetails;
ProductCardCart.Title = ProductCardCartTitle;
ProductCardCart.Description = ProductCardCartDescription;
ProductCardCart.Footer = ProductCardCartFooter;
ProductCardCart.Actions = ProductCardCartActions;
ProductCardCart.Price = ProductCardCartPrice;

ProductCardCartMedia.displayName = "ProductCardCart.Media";
ProductCardCartContent.displayName = "ProductCardCart.Content";
ProductCardCartDetails.displayName = "ProductCardCart.Details";
ProductCardCartTitle.displayName = "ProductCardCart.Title";
ProductCardCartDescription.displayName = "ProductCardCart.Description";
ProductCardCartFooter.displayName = "ProductCardCart.Footer";
ProductCardCartActions.displayName = "ProductCardCart.Actions";
ProductCardCartPrice.displayName = "ProductCardCart.Price";
