"use client";

import { ShoppingBag } from "lucide-react";

import { selectCartItemCount, useStoreCart } from "@entities/cart";
import { Button } from "@shared/ui";

export const ToggleCartButton = () => {
    const toggle = useStoreCart((state) => state.toggle);
    const itemCount = useStoreCart(selectCartItemCount);

    return (
        <span className="relative inline-flex shrink-0">
            <Button
                onlyIcon
                kind="outline"
                aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
                onClick={() => toggle()}
            >
                <ShoppingBag />
            </Button>

            {itemCount > 0 ? (
                <span
                    aria-hidden
                    className="pointer-events-none absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full bg-[#FE5F00] text-white text-[10px] -translate-y-1/3 translate-x-1/3"
                >
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            ) : null}
        </span>
    );
};
