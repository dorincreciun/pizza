"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { MoveLeft } from "lucide-react";

import { useStoreCart } from "@entities/cart";
import { Button } from "@shared/ui";

export const CartEmpty = () => {
    const t = useTranslations("widgets.cart.empty");
    const setOpen = useStoreCart((state) => state.setOpen);

    return (
        <div className="flex size-full items-center justify-center">
            <div className="flex w-75 flex-col items-center gap-6">
                <Image src="/empty-cart.png" alt="" width={120} height={120} />
                <div>
                    <div className="text-center text-[22px] font-semibold">
                        {t("title")}
                    </div>
                    <p className="text-muted text-center text-base">
                        {t("description")}
                    </p>
                </div>
                <Button
                    type="button"
                    color="primary"
                    className="w-full"
                    onClick={() => setOpen(false)}
                >
                    <MoveLeft aria-hidden />
                    {t("back")}
                </Button>
            </div>
        </div>
    );
};
