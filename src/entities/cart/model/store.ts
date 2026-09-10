import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getCartLineKey, isSameCartLine } from "./cart-line";
import type { CartItem, CartStoreProps } from "./types";

export const useStoreCart = create<CartStoreProps>()(
    persist(
        (set) => ({
            items: [],
            open: false,

            setOpen: (open) => set({ open }),
            toggle: () => set((state) => ({ open: !state.open })),

            addItem: (item) =>
                set((state) => {
                    const quantity = Math.max(1, item.quantity ?? 1);
                    const nextItem: CartItem = {
                        variantId: item.variantId,
                        productId: item.productId,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        variantLabel: item.variantLabel,
                        unitPriceInCents: item.unitPriceInCents,
                        quantity,
                        extraIngredientIds: item.extraIngredientIds,
                    };

                    const existingIndex = state.items.findIndex((existing) =>
                        isSameCartLine(existing, nextItem),
                    );

                    if (existingIndex === -1) {
                        return { items: [...state.items, nextItem] };
                    }

                    const items = state.items.map((existing, index) =>
                        index === existingIndex
                            ? {
                                  ...existing,
                                  quantity: existing.quantity + quantity,
                              }
                            : existing,
                    );

                    return { items };
                }),

            updateQuantity: (lineKey, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (item) => getCartLineKey(item) !== lineKey,
                            ),
                        };
                    }

                    return {
                        items: state.items.map((item) =>
                            getCartLineKey(item) === lineKey
                                ? { ...item, quantity }
                                : item,
                        ),
                    };
                }),

            removeItem: (lineKey) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => getCartLineKey(item) !== lineKey,
                    ),
                })),
        }),
        {
            name: "cart-storage",
            version: 2,
            migrate: (persistedState) => {
                const state = persistedState as Partial<
                    Pick<CartStoreProps, "items">
                >;
                const items = (state.items ?? []).filter(
                    (item): item is CartItem =>
                        Boolean(
                            item?.variantId &&
                            item?.productId &&
                            item?.name &&
                            typeof item.unitPriceInCents === "number",
                        ),
                );

                return { items };
            },
            partialize: (state) => ({ items: state.items }),
        },
    ),
);
