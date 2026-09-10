import type { ComponentProps, HTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Link } from "@shared/lib/i18n";
import { cn } from "@shared/utils";

// --- STYLES (CVA) ---

const productCardMediaVariants = cva(
    [
        "relative flex items-center justify-center overflow-hidden rounded-2xl",
        "bg-[#FE5F00]/5 p-5 transition-colors duration-200",
        "hover:bg-[#FE5F00]/10",
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

export type ProductCardRootProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardMediaProps = HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof productCardMediaVariants>;

/**
 * Extinde `Link` din `next-intl/navigation`: suportă forma
 * `href={{ pathname: '/products/[id]', params: { id } }}` cu pathnames i18n
 * type-safe declarate în `@shared/config/i18n`.
 */
export type ProductCardMediaLinkProps = ComponentProps<typeof Link>;

export type ProductCardMediaActionsProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardMediaActionLinkProps = ComponentProps<typeof Link>;

export type ProductCardMediaActionButtonProps = ComponentProps<"button">;

export type ProductCardContentProps = HTMLAttributes<HTMLDivElement>;

export type ProductCardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export type ProductCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type ProductCardFooterProps = HTMLAttributes<HTMLDivElement>;

// --- COMPONENT ---

/**
 * Container card produs (layout vertical).
 */
const ProductCardRoot = ({
    className,
    children,
    ...rest
}: ProductCardRootProps) => (
    <div
        className={cn("relative flex w-full flex-col", className)}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Zona media (imagine, placeholder). Poate include `ProductCard.MediaLink`.
 */
const ProductCardMedia = ({
    className,
    aspect,
    children,
    ...rest
}: ProductCardMediaProps) => (
    <div
        className={cn("group", productCardMediaVariants({ aspect }), className)}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Link invizibil peste media (Next.js `Link`). Acoperă întreaga zonă media.
 */
/** Plasează în interiorul `ProductCard.Media` (poziționare `absolute`). */
const ProductCardMediaLink = ({
    className,
    ...rest
}: ProductCardMediaLinkProps) => (
    <Link className={cn("absolute inset-0 z-10", className)} {...rest} />
);

/**
 * Overlay-ul cu acțiuni afișat la hover/focus pe zona media.
 */
const ProductCardMediaActions = ({
    className,
    children,
    ...rest
}: ProductCardMediaActionsProps) => (
    <div
        className={cn(
            "absolute z-20 transition-opacity duration-200",
            "inset-x-2 bottom-2 flex flex-row items-stretch justify-center gap-2",
            "lg:inset-0 lg:flex-col lg:items-center lg:justify-center lg:p-3",
            "lg:bg-black/25 lg:pointer-events-none lg:opacity-0",
            "lg:group-hover:pointer-events-auto lg:group-hover:opacity-100",
            "lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

/**
 * Acțiune de overlay care face navigare (link).
 */
const ProductCardMediaActionLink = ({
    className,
    children,
    ...rest
}: ProductCardMediaActionLinkProps) => (
    <Link
        className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg",
            "bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5",
            "text-xs font-medium text-gray-800 transition-colors duration-150",
            "hover:bg-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
            "lg:flex-none lg:min-w-34 lg:bg-white/92 lg:shadow-none lg:ring-0",
            className,
        )}
        {...rest}
    >
        {children}
    </Link>
);

/**
 * Acțiune de overlay tip buton (poate fi conectată ulterior la modală).
 */
const ProductCardMediaActionButton = ({
    className,
    type = "button",
    children,
    ...rest
}: ProductCardMediaActionButtonProps) => (
    <button
        type={type}
        className={cn(
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg",
            "bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5",
            "text-xs font-medium text-gray-700 transition-colors duration-150",
            "hover:bg-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
            "lg:flex-none lg:min-w-34 lg:bg-white/85 lg:shadow-none lg:ring-0",
            className,
        )}
        {...rest}
    >
        {children}
    </button>
);

/**
 * Conținut text (titlu, descriere).
 */
const ProductCardContent = ({
    className,
    children,
    ...rest
}: ProductCardContentProps) => (
    <div className={cn("flex-1 pt-4 pb-2", className)} {...rest}>
        {children}
    </div>
);

/**
 * Titlul produsului.
 */
const ProductCardTitle = ({
    className,
    children,
    ...rest
}: ProductCardTitleProps) => (
    <h3
        className={cn("mb-2 text-xl font-bold tracking-tight text-gray-900", className)}
        {...rest}
    >
        {children}
    </h3>
);

/**
 * Descriere scurtă (max. 2 rânduri).
 */
const ProductCardDescription = ({
    className,
    children,
    ...rest
}: ProductCardDescriptionProps) => (
    <p
        className={cn("line-clamp-2 text-sm text-[#B1B1B1]", className)}
        {...rest}
    >
        {children}
    </p>
);

/**
 * Acțiuni / preț (partea de jos a cardului).
 */
const ProductCardFooter = ({
    className,
    children,
    ...rest
}: ProductCardFooterProps) => (
    <div
        className={cn(
            "mt-auto flex items-center justify-between gap-3 pt-2",
            className,
        )}
        {...rest}
    >
        {children}
    </div>
);

type ProductCardCompound = typeof ProductCardRoot & {
    Media: typeof ProductCardMedia;
    MediaLink: typeof ProductCardMediaLink;
    MediaActions: typeof ProductCardMediaActions;
    MediaActionLink: typeof ProductCardMediaActionLink;
    MediaActionButton: typeof ProductCardMediaActionButton;
    Content: typeof ProductCardContent;
    Title: typeof ProductCardTitle;
    Description: typeof ProductCardDescription;
    Footer: typeof ProductCardFooter;
};

ProductCardRoot.displayName = "ProductCard";

/**
 * Card produs compus pentru catalog.
 * @example
 * ```tsx
 * <ProductCard>
 *   <ProductCard.Media>
 *     <ProductCard.MediaLink href={productHref} aria-label={t("viewProduct")} />
 *     <Image src={imageUrl} alt="" width={200} height={200} />
 *   </ProductCard.Media>
 *   <ProductCard.Content>
 *     <ProductCard.Title>{name}</ProductCard.Title>
 *     <ProductCard.Description>{shortDescription}</ProductCard.Description>
 *   </ProductCard.Content>
 *   <ProductCard.Footer>
 *     <span className="font-bold">{price}</span>
 *     <Button size="sm">Adaugă</Button>
 *   </ProductCard.Footer>
 * </ProductCard>
 * ```
 */
export const ProductCard = ProductCardRoot as ProductCardCompound;

ProductCard.Media = ProductCardMedia;
ProductCard.MediaLink = ProductCardMediaLink;
ProductCard.MediaActions = ProductCardMediaActions;
ProductCard.MediaActionLink = ProductCardMediaActionLink;
ProductCard.MediaActionButton = ProductCardMediaActionButton;
ProductCard.Content = ProductCardContent;
ProductCard.Title = ProductCardTitle;
ProductCard.Description = ProductCardDescription;
ProductCard.Footer = ProductCardFooter;

ProductCardMedia.displayName = "ProductCard.Media";
ProductCardMediaLink.displayName = "ProductCard.MediaLink";
ProductCardMediaActions.displayName = "ProductCard.MediaActions";
ProductCardMediaActionLink.displayName = "ProductCard.MediaActionLink";
ProductCardMediaActionButton.displayName = "ProductCard.MediaActionButton";
ProductCardContent.displayName = "ProductCard.Content";
ProductCardTitle.displayName = "ProductCard.Title";
ProductCardDescription.displayName = "ProductCard.Description";
ProductCardFooter.displayName = "ProductCard.Footer";
