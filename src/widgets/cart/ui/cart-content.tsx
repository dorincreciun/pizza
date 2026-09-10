"use client";

import { selectIsCartEmpty, useStoreCart } from "@entities/cart";

import { CartEmpty } from "./cart-empty";
import { CartItemsList } from "./cart-items-list";

export const CartContent = () => {
    const isEmpty = useStoreCart(selectIsCartEmpty);

    if (isEmpty) {
        return <CartEmpty />;
    }

    return <CartItemsList />;
};
