import { getTranslations } from "next-intl/server";

import { APP_ROUTES } from "@shared/config";
import { Link } from "@shared/lib/i18n";
import { Button } from "@shared/ui";

export async function ProductsEmpty() {
    const t = await getTranslations("widgets.products.empty");

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-xl font-semibold text-gray-900">{t("title")}</p>
            <p className="max-w-md text-base text-gray-500">{t("description")}</p>
            <Button asChild kind="outline">
                <Link href={APP_ROUTES.ROOT}>{t("reset")}</Link>
            </Button>
        </div>
    );
}
