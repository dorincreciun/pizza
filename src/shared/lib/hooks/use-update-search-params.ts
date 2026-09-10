"use client";

import { useSearchParams } from "next/navigation";
import { APP_ROUTES } from "@shared/config";
import { useRouter } from "@shared/lib/i18n";

export function useUpdateSearchParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParams = (updates: Record<string, string | number | null | undefined>, options?: { resetPage?: boolean }) => {
        const params = new URLSearchParams(searchParams?.toString() ?? "");

        if (options?.resetPage !== false) {
            params.delete("page");
        }

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        const query = Object.fromEntries(params.entries());

        if (Object.keys(query).length > 0) {
            router.push({ pathname: APP_ROUTES.ROOT, query });
            return;
        }

        router.push({ pathname: APP_ROUTES.ROOT });
    };

    return { updateParams, searchParams };
}