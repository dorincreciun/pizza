"use client";

import { useMemo, useState } from "react";
import type { PizzaCrust, PizzaSize } from "@prisma/client";

import {
    findVariant,
    getDefaultVariant,
    type ProductDetailModel,
} from "@entities/product";
import { formatPrice } from "@shared/utils";

export function useProductCustomization(product: ProductDetailModel) {
    const [size, setSize] = useState<PizzaSize | undefined>(
        product.sizes[0]?.value,
    );
    const [crust, setCrust] = useState<PizzaCrust | undefined>(
        product.crusts[0]?.value,
    );
    const [extraIngredientIds, setExtraIngredientIds] = useState<string[]>([]);

    const variant = useMemo(() => {
        if (product.sizes.length && product.crusts.length && size && crust) {
            return (
                findVariant(product.variants, size, crust) ??
                getDefaultVariant(product.variants)
            );
        }

        return getDefaultVariant(product.variants);
    }, [product.crusts.length, product.sizes.length, product.variants, crust, size]);

    const variantLabel = useMemo(() => {
        const parts: string[] = [];
        const sizeLabel = product.sizes.find((item) => item.value === size)?.label;
        const crustLabel = product.crusts.find((item) => item.value === crust)
            ?.label;

        if (sizeLabel) {
            parts.push(sizeLabel);
        }

        if (crustLabel) {
            parts.push(crustLabel);
        }

        return parts.length ? parts.join(" · ") : undefined;
    }, [product.crusts, product.sizes, crust, size]);

    const extrasTotalInCents = useMemo(
        () =>
            extraIngredientIds.reduce((sum, id) => {
                const addon = product.addons.find((item) => item.id === id);
                return sum + (addon?.extraPriceInCents ?? 0);
            }, 0),
        [extraIngredientIds, product.addons],
    );

    const totalPriceInCents = (variant?.priceInCents ?? 0) + extrasTotalInCents;

    return {
        size,
        setSize,
        crust,
        setCrust,
        extraIngredientIds,
        setExtraIngredientIds,
        variant,
        variantLabel,
        totalPriceInCents,
        formattedPrice: formatPrice(totalPriceInCents),
        canAdd: Boolean(variant?.id),
    };
}
