"use client";

import type { ProductListItem } from "@entities/product";
import { Button } from "@shared/ui";
import { useTranslations } from "next-intl";

import { buildCartItemFromCatalogItem } from "../model/build-cart-item";
import { useAddToCart } from "../lib/use-add-to-cart";

interface AddToCartCatalogButtonProps {
    product: ProductListItem;
    className?: string;
}

export const AddToCartCatalogButton = ({
    product,
    className,
}: AddToCartCatalogButtonProps) => {
    const t = useTranslations("widgets.products");
    const addToCart = useAddToCart();

    const handleClick = () => {
        if (!product.defaultVariantId) {
            return;
        }

        addToCart(buildCartItemFromCatalogItem(product));
    };

    return (
        <Button
            type="button"
            size="sm"
            className={className}
            disabled={!product.defaultVariantId}
            onClick={handleClick}
        >
            {t("addToCart")}
        </Button>
    );
};
