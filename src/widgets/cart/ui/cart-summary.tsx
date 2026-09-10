"use client";

import { useTranslations } from "next-intl";

import { selectCartTotalInCents, useStoreCart } from "@entities/cart";
import { PlaceOrderForm } from "@features/checkout";
import { formatPrice } from "@shared/utils";

interface CartSummaryProps {
    isAuthenticated: boolean;
}

export const CartSummary = ({ isAuthenticated }: CartSummaryProps) => {
    const t = useTranslations("widgets.cart.summary");
    const totalInCents = useStoreCart(selectCartTotalInCents);

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t("total")}</span>
                <span className="text-base font-bold text-gray-900">
                    {formatPrice(totalInCents)}
                </span>
            </div>
            <PlaceOrderForm isAuthenticated={isAuthenticated} />
        </div>
    );
};
