import type { AddCartItemInput } from "@entities/cart";
import type {
    ProductAddonModel,
    ProductDetailModel,
    ProductListItem,
    ProductVariantModel,
} from "@entities/product";

function sumExtrasPriceInCents(
    extraIngredientIds: string[],
    addons: ProductAddonModel[],
) {
    return extraIngredientIds.reduce((sum, id) => {
        const addon = addons.find((item) => item.id === id);
        return sum + (addon?.extraPriceInCents ?? 0);
    }, 0);
}

export function buildCartItemFromProduct(params: {
    product: Pick<ProductDetailModel, "id" | "name" | "imageUrl" | "addons">;
    variant: ProductVariantModel;
    variantLabel?: string;
    extraIngredientIds: string[];
    quantity?: number;
}): AddCartItemInput {
    const extrasTotal = sumExtrasPriceInCents(
        params.extraIngredientIds,
        params.product.addons,
    );

    return {
        variantId: params.variant.id,
        productId: params.product.id,
        name: params.product.name,
        imageUrl: params.product.imageUrl,
        variantLabel: params.variantLabel,
        unitPriceInCents: params.variant.priceInCents + extrasTotal,
        extraIngredientIds: params.extraIngredientIds.length
            ? params.extraIngredientIds
            : undefined,
        quantity: params.quantity ?? 1,
    };
}

export function buildCartItemFromCatalogItem(
    product: ProductListItem,
    quantity = 1,
): AddCartItemInput {
    return {
        variantId: product.defaultVariantId,
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPriceInCents: product.unitPriceInCents,
        quantity,
    };
}
