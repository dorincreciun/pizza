"use client";

import type { ProductDetailModel } from "@entities/product";
import { ProductCustomizationPanel } from "@features/product-customization";
import { useTranslations } from "next-intl";

import { buildCartItemFromProduct } from "../model/build-cart-item";
import { useAddToCart } from "../lib/use-add-to-cart";
import { useProductCustomization } from "../lib/use-product-customization";

interface AddToCartPanelProps {
    product: ProductDetailModel;
    compact?: boolean;
    className?: string;
    buttonClassName?: string;
}

export const AddToCartPanel = ({
    product,
    compact = false,
    className,
    buttonClassName,
}: AddToCartPanelProps) => {
    const t = useTranslations("widgets.productDetail");
    const addToCart = useAddToCart();
    const {
        size,
        setSize,
        crust,
        setCrust,
        extraIngredientIds,
        setExtraIngredientIds,
        variant,
        variantLabel,
        formattedPrice,
        canAdd,
    } = useProductCustomization(product);

    const handleAddToCart = () => {
        if (!variant) {
            return;
        }

        addToCart(
            buildCartItemFromProduct({
                product,
                variant,
                variantLabel,
                extraIngredientIds,
            }),
        );
    };

    return (
        <ProductCustomizationPanel
            name={product.name}
            description={product.description}
            sizes={product.sizes}
            crusts={product.crusts}
            addons={product.addons}
            chooseSizeLabel={t("chooseSize")}
            chooseCrustLabel={t("chooseCrust")}
            addExtrasLabel={t("addExtras")}
            addToCartLabel={t("addToCartFor", { price: formattedPrice })}
            sizeValue={size}
            onSizeChange={setSize}
            crustValue={crust}
            onCrustChange={setCrust}
            selectedAddonIds={extraIngredientIds}
            onSelectedAddonIdsChange={setExtraIngredientIds}
            onAddToCart={handleAddToCart}
            addToCartDisabled={!canAdd}
            compact={compact}
            className={className}
            buttonClassName={buttonClassName}
        />
    );
};
