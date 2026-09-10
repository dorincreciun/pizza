export type {
    ProductModel,
    ProductDetailModel,
    ProductVariantModel,
    ProductListItem,
    ProductOption,
    ProductAddonModel,
    ProductsPageMeta,
    ProductsPageResult,
    ProductFilterOptions,
    FilterOption,
} from "./model/types";

export { getProduct, type GetProductProps } from "./api/get-product";
export { getProducts, type GetProductsProps } from "./api/get-products";
export { getFilterOptions } from "./api/get-filter-options";
export { findVariant, getDefaultVariant } from "./lib/find-variant";

export {
    ProductCard,
    type ProductCardRootProps,
    type ProductCardMediaProps,
    type ProductCardMediaLinkProps,
    type ProductCardContentProps,
    type ProductCardTitleProps,
    type ProductCardDescriptionProps,
    type ProductCardFooterProps,
} from "./ui/product-card";

export {
    ProductCardCart,
    type ProductCardCartRootProps,
    type ProductCardCartMediaProps,
    type ProductCardCartContentProps,
    type ProductCardCartDetailsProps,
    type ProductCardCartTitleProps,
    type ProductCardCartDescriptionProps,
    type ProductCardCartFooterProps,
    type ProductCardCartActionsProps,
    type ProductCardCartPriceProps,
} from "./ui/product-card-cart";

export {
    ProductCardSkeleton,
    ProductCardSkeletonList,
    type ProductCardSkeletonListProps,
} from "./ui/product-card-skeleton";
