import type { PizzaCrust, PizzaSize } from "@prisma/client";

import {
    PIZZA_CRUST_ORDER,
    PIZZA_SIZE_ORDER,
} from "../model/constants";
import type { ProductOption, ProductVariantModel } from "../model/types";

type PizzaEnumKey =
    | `PizzaSize.${PizzaSize}`
    | `PizzaCrust.${PizzaCrust}`;

type EnumLabel = (key: PizzaEnumKey) => string;

export function buildSizeOptions(
    variants: ProductVariantModel[],
    t: EnumLabel,
): ProductOption<PizzaSize>[] {
    const unique = [
        ...new Set(
            variants
                .map((variant) => variant.size)
                .filter((size): size is PizzaSize => size != null),
        ),
    ].sort(
        (a, b) => PIZZA_SIZE_ORDER.indexOf(a) - PIZZA_SIZE_ORDER.indexOf(b),
    );

    return unique.map((size) => ({
        value: size,
        label: t(`PizzaSize.${size}`),
    }));
}

export function buildCrustOptions(
    variants: ProductVariantModel[],
    t: EnumLabel,
): ProductOption<PizzaCrust>[] {
    const unique = [
        ...new Set(
            variants
                .map((variant) => variant.crust)
                .filter((crust): crust is PizzaCrust => crust != null),
        ),
    ].sort(
        (a, b) => PIZZA_CRUST_ORDER.indexOf(a) - PIZZA_CRUST_ORDER.indexOf(b),
    );

    return unique.map((crust) => ({
        value: crust,
        label: t(`PizzaCrust.${crust}`),
    }));
}
