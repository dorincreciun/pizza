"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
    getCartLineKey,
    selectCartItems,
    useStoreCart,
} from "@entities/cart";
import { ProductCardCart } from "@entities/product";
import { Button } from "@shared/ui";
import { formatPrice } from "@shared/utils";

const quantityButtonClassName = "!size-7 shrink-0 [&_svg]:!size-3.5";

export const CartItemsList = () => {
    const items = useStoreCart(selectCartItems);
    const updateQuantity = useStoreCart((state) => state.updateQuantity);
    const removeItem = useStoreCart((state) => state.removeItem);

    return (
        <ul className="flex flex-col gap-3">
            {items.map((item) => {
                const lineKey = getCartLineKey(item);
                const lineTotal = item.unitPriceInCents * item.quantity;
                const details = [
                    item.variantLabel,
                    item.extraIngredientIds?.length
                        ? `+${item.extraIngredientIds.length} extras`
                        : null,
                ]
                    .filter(Boolean)
                    .join(" · ");

                return (
                    <li key={lineKey}>
                        <ProductCardCart>
                            <ProductCardCart.Media size="sm">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    className="aspect-square size-full object-contain"
                                />
                            </ProductCardCart.Media>

                            <ProductCardCart.Content>
                                <ProductCardCart.Details>
                                    <ProductCardCart.Title>
                                        {item.name}
                                    </ProductCardCart.Title>
                                    {details ? (
                                        <ProductCardCart.Description>
                                            {details}
                                        </ProductCardCart.Description>
                                    ) : null}
                                </ProductCardCart.Details>

                                <ProductCardCart.Footer>
                                    <ProductCardCart.Actions>
                                        <div className="flex items-center gap-0.5">
                                            <Button
                                                type="button"
                                                onlyIcon
                                                kind="outline"
                                                size="sm"
                                                className={quantityButtonClassName}
                                                aria-label="Decrease quantity"
                                                onClick={() =>
                                                    updateQuantity(
                                                        lineKey,
                                                        item.quantity - 1,
                                                    )
                                                }
                                            >
                                                <Minus aria-hidden />
                                            </Button>
                                            <span className="min-w-6 px-0.5 text-center text-xs font-semibold tabular-nums text-gray-700">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                type="button"
                                                onlyIcon
                                                kind="outline"
                                                size="sm"
                                                className={quantityButtonClassName}
                                                aria-label="Increase quantity"
                                                onClick={() =>
                                                    updateQuantity(
                                                        lineKey,
                                                        item.quantity + 1,
                                                    )
                                                }
                                            >
                                                <Plus aria-hidden />
                                            </Button>
                                            <Button
                                                type="button"
                                                onlyIcon
                                                kind="ghost"
                                                size="sm"
                                                className={`${quantityButtonClassName} ml-1 text-gray-400 enabled:hover:text-gray-600`}
                                                aria-label="Remove item"
                                                onClick={() =>
                                                    removeItem(lineKey)
                                                }
                                            >
                                                <Trash2 aria-hidden />
                                            </Button>
                                        </div>
                                    </ProductCardCart.Actions>
                                    <ProductCardCart.Price>
                                        {formatPrice(lineTotal)}
                                    </ProductCardCart.Price>
                                </ProductCardCart.Footer>
                            </ProductCardCart.Content>
                        </ProductCardCart>
                    </li>
                );
            })}
        </ul>
    );
};
