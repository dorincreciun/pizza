import { createNavigation } from "next-intl/navigation";
import { defaultLocale, locales, pathnames } from "@shared/config";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
    locales: locales,
    defaultLocale: defaultLocale,
    pathnames: pathnames,
});
