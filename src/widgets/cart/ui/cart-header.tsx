"use client";

import { useTranslations } from "next-intl";

import { selectCartItemCount, useStoreCart } from "@entities/cart";

export const CartHeader = () => {
    const t = useTranslations("widgets.cart");
    const itemCount = useStoreCart(selectCartItemCount);

    return (
        <h2 className="min-w-0 pr-2 text-base leading-snug text-gray-900">
            {t("title")}{" "}
            <span className="font-bold">
                {t("itemsCount", { count: itemCount })}
            </span>
        </h2>
    );
};
