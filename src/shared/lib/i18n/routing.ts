import { defaultLocale, locales, pathnames } from "@shared/config/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: locales,
    defaultLocale: defaultLocale,
    pathnames: pathnames,
});
