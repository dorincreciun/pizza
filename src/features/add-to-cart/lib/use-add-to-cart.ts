"use client";

import { useCallback } from "react";

import { type AddCartItemInput, useStoreCart } from "@entities/cart";

export function useAddToCart() {
    const addItem = useStoreCart((state) => state.addItem);
    const setOpen = useStoreCart((state) => state.setOpen);

    return useCallback(
        (item: AddCartItemInput) => {
            addItem(item);
            setOpen(true);
        },
        [addItem, setOpen],
    );
}
