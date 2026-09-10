import { getTranslations } from "next-intl/server";
import { Pizza } from "lucide-react";

import { APP_ROUTES } from "@shared/config";
import { Link } from "@shared/lib/i18n";
import { Button } from "@shared/ui";

export async function OrdersEmpty() {
    const t = await getTranslations("pages.OrdersPage.empty");

    return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Pizza className="size-12 text-gray-300" aria-hidden />
            <div>
                <p className="text-[22px] font-semibold text-gray-900">
                    {t("title")}
                </p>
                <p className="mt-1 text-base text-gray-500">{t("description")}</p>
            </div>
            <Button asChild>
                <Link href={APP_ROUTES.ROOT}>{t("back")}</Link>
            </Button>
        </div>
    );
}
