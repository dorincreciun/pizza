import { APP_ROUTES } from "@shared/config";
import type { useRouter } from "@shared/lib/i18n";

const RETURN_TO_ROUTES = {
    orders: APP_ROUTES.ORDERS,
} as const;

export type ReturnToKey = keyof typeof RETURN_TO_ROUTES;

type AppRouter = Pick<ReturnType<typeof useRouter>, "back" | "replace">;

export function resolveReturnTo(value: string | null | undefined): ReturnToKey | null {
    if (!value || !(value in RETURN_TO_ROUTES)) {
        return null;
    }

    return value as ReturnToKey;
}

export function buildReturnToQuery(returnTo: ReturnToKey) {
    return { returnTo };
}

export function getReturnToRoute(returnTo: ReturnToKey) {
    return RETURN_TO_ROUTES[returnTo];
}

export function navigateAfterAuth(
    router: AppRouter,
    returnTo: ReturnToKey | null,
) {
    if (returnTo) {
        router.replace(RETURN_TO_ROUTES[returnTo]);
        return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
    }

    router.replace(APP_ROUTES.ROOT);
}

/**
 * Închide modalul. Dacă există `returnTo`, nu folosim `back()` —
 * am ajunge pe o rută protejată care redirecționează din nou la sign-in.
 */
export function closeModalRoute(
    router: AppRouter,
    returnTo: ReturnToKey | null,
) {
    if (returnTo) {
        router.replace(APP_ROUTES.ROOT);
        return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
    }

    router.replace(APP_ROUTES.ROOT);
}

export function navigateAfterSignOut(router: AppRouter) {
    router.replace(APP_ROUTES.ROOT);
}
