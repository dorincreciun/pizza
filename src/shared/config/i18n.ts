import { APP_ROUTES, AppRoute } from "./routes";

export const locales = ["en", "ru", "ro"] as const;
export const defaultLocale = locales[0];

export type Locale = (typeof locales)[number];

type LocalizedPath = {
    [K in Locale]: string;
};

export type PathnameMap = {
    [K in AppRoute]: string | LocalizedPath;
};

export const pathnames = {
    [APP_ROUTES.ROOT]: "/",

    [APP_ROUTES.ORDERS]: {
        en: "/orders",
        ro: "/comenzi",
        ru: "/zakazy",
    },

    [APP_ROUTES.PRODUCT]: {
        en: "/products/[id]",
        ro: "/produse/[id]",
        ru: "/produkty/[id]",
    },

    /* Modals */
    [APP_ROUTES.SIGN_IN]: {
        en: "/auth/sign-in",
        ro: "/auth/sign-in",
        ru: "/auth/sign-in",
    },

    [APP_ROUTES.BUILDER]: {
        en: "/builder/[id]",
        ro: "/builder/[id]",
        ru: "/builder/[id]",
    },
} satisfies PathnameMap;