export const APP_ROUTES = {
    ROOT: "/",
    ORDERS: "/orders",
    PRODUCT: "/product/[id]",

    /* Modals */
    SIGN_IN: "/auth/sign-in",
    BUILDER: "/builder/[id]",
} as const;

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES];