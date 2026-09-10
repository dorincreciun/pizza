import type { Prisma, ProductVariant } from "@prisma/client";

import { mapIngredient } from "@entities/ingredient/@x/product";
import { formatPrice } from "@shared/utils";

import {
    buildCrustOptions,
    buildSizeOptions,
} from "../lib/build-product-options";
import type {
    ProductAddonModel,
    ProductDetailModel,
    ProductListItem,
    ProductModel,
    ProductVariantModel,
} from "../model/types";

/** Forma completa a unui produs cu relatii (folosit pentru detaliu). */
export type ProductRow = Prisma.ProductGetPayload<{
    include: {
        translations: true;
        ingredients: {
            include: {
                translations: true;
            };
        };
        variants: true;
    };
}>;

type ProductAddonRow = ProductRow["ingredients"][number];

import type { PizzaCrust, PizzaSize } from "@prisma/client";

type PizzaEnumKey =
    | `PizzaSize.${PizzaSize}`
    | `PizzaCrust.${PizzaCrust}`;

type EnumLabel = (key: PizzaEnumKey) => string;

export function mapProductAddon(ingredient: ProductAddonRow): ProductAddonModel {
    const translation = ingredient.translations?.[0];

    return {
        id: ingredient.id,
        name: translation?.name ?? "",
        imageUrl: ingredient.imageUrl ?? "",
        extraPrice: formatPrice(ingredient.extraPrice),
        extraPriceInCents: ingredient.extraPrice,
    };
}

export function mapProductDetail(
    product: ProductRow,
    t: EnumLabel,
): ProductDetailModel {
    const translation = product.translations?.[0];
    const variants = product.variants.map(mapProductVariant);

    return {
        id: product.id,
        imageUrl: product.imageUrl ?? "",
        price: formatPrice(product.basePrice),
        name: translation?.name ?? "",
        description: translation?.description ?? "",
        short_description: translation?.shortDescription ?? "",
        sizes: buildSizeOptions(variants, t),
        crusts: buildCrustOptions(variants, t),
        addons: product.ingredients.map(mapProductAddon),
        variants,
    };
}

/** Forma minima a unui produs pentru listare. */
export type ProductListRow = {
    id: string;
    imageUrl: string | null;
    basePrice: number;
    variants: { id: string; price: number }[];
    translations: {
        name: string;
        shortDescription: string;
    }[];
};

export function mapProductVariant(
    variant: ProductVariant,
): ProductVariantModel {
    return {
        id: variant.id,
        price: formatPrice(variant.price),
        priceInCents: variant.price,
        variantType: variant.variantType,
        size: variant.size,
        crust: variant.crust,
    };
}

export function mapProductListItem(
    product: ProductListRow,
): ProductListItem {
    const translation = product.translations[0];

    const defaultVariant = product.variants[0];

    return {
        id: product.id,
        imageUrl: product.imageUrl ?? "",
        name: translation?.name ?? "",
        price: formatPrice(defaultVariant?.price ?? product.basePrice),
        short_description: translation?.shortDescription ?? "",
        defaultVariantId: defaultVariant?.id ?? "",
        unitPriceInCents: defaultVariant?.price ?? product.basePrice,
    };
}

export function mapProduct(product: ProductRow): ProductModel {
    const translation = product.translations?.[0];

    return {
        id: product.id,
        imageUrl: product.imageUrl ?? "",
        price: formatPrice(product.basePrice),
        name: translation?.name ?? "",
        description: translation?.description ?? "",
        short_description: translation?.shortDescription ?? "",
        ingredients: product.ingredients.map(mapIngredient),
        variants: product.variants.map(mapProductVariant),
    };
}
