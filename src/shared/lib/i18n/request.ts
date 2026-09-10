import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@shared/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    const [shared, features, widgets, pages] = await Promise.all([
        import(`../../../../messages/${locale}/shared.json`).then(
            (m) => m.default,
        ),
        import(`../../../../messages/${locale}/features.json`).then(
            (m) => m.default,
        ),
        import(`../../../../messages/${locale}/widgets.json`).then(
            (m) => m.default,
        ),
        import(`../../../../messages/${locale}/pages.json`).then(
            (m) => m.default,
        ),
    ]);
    return {
        locale,
        messages: {
            shared,
            features,
            widgets,
            pages
        }
    };
});
