import type { CartStoreProps } from "./types";

export const selectCartItems = (state: CartStoreProps) => state.items;

export const selectIsCartEmpty = (state: CartStoreProps) =>
    state.items.length === 0;

export const selectCartItemCount = (state: CartStoreProps) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalInCents = (state: CartStoreProps) =>
    state.items.reduce(
        (sum, item) => sum + item.unitPriceInCents * item.quantity,
        0,
    );
