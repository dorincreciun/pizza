"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { APP_ROUTES } from "@shared/config";
import { Link } from "@shared/lib/i18n";

export const HeaderLogo = () => {
    const t = useTranslations("widgets.header");

    return (
        <div className="relative flex max-w-max shrink-0 items-center gap-4">
            <Link href={APP_ROUTES.ROOT} className="absolute inset-0 z-10" />
            <Image src="/logo.png" alt="" width={40} height={40} />
            <div className="max-sm:hidden">
                <div className="text-2xl leading-6.5 font-black tracking-[1%]">
                    NEXT PIZZA
                </div>
                <div className="leading-5 text-[#7B7B7B]">{t("tagline")}</div>
            </div>
        </div>
    );
};
