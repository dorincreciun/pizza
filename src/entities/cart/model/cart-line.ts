import type { CartItem } from "./types";

export function normalizeExtraIngredientIds(ids: string[] | undefined) {
    return [...(ids ?? [])].sort();
}

export function getCartLineKey(
    item: Pick<CartItem, "variantId" | "extraIngredientIds">,
) {
    const extras = normalizeExtraIngredientIds(item.extraIngredientIds).join(",");

    return `${item.variantId}:${extras}`;
}

export function isSameCartLine(a: CartItem, b: CartItem) {
    return getCartLineKey(a) === getCartLineKey(b);
}
