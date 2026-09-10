"use client";

import { useTranslations } from "next-intl";
import { MoveRight } from "lucide-react";

import { selectCartTotalInCents, useStoreCart } from "@entities/cart";
import { Button } from "@shared/ui";
import { formatPrice } from "@shared/utils";

export const CartSummary = () => {
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
            <Button type="button" className="w-full" size="md">
                {t("checkout")} <MoveRight aria-hidden />
            </Button>
        </div>
    );
};
