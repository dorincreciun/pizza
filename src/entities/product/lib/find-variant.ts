import type { PizzaCrust, PizzaSize } from "@prisma/client";

import type { ProductVariantModel } from "@entities/product";

export function findVariant(
    variants: ProductVariantModel[],
    size: PizzaSize,
    crust: PizzaCrust,
) {
    return variants.find(
        (variant) => variant.size === size && variant.crust === crust,
    );
}

export function getDefaultVariant(variants: ProductVariantModel[]) {
    return variants[0] ?? null;
}
