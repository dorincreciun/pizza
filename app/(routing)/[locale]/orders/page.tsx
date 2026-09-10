import { getCurrentUser } from "@entities/user";
import { MyOrdersPage } from "@pages/my-orders";
import { APP_ROUTES } from "@shared/config";
import { redirect } from "@shared/lib/i18n";
import { buildReturnToQuery } from "@shared/lib/routing";
import { getLocale } from "next-intl/server";

export default async function OrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        const locale = await getLocale();

        redirect({
            href: {
                pathname: APP_ROUTES.SIGN_IN,
                query: buildReturnToQuery("orders"),
            },
            locale,
        });
    }

    return <MyOrdersPage />;
}
