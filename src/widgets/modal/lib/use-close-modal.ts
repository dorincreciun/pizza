"use client";

import { useSearchParams } from "next/navigation";

import { useRouter } from "@shared/lib/i18n";
import { closeModalRoute, resolveReturnTo } from "@shared/lib/routing";

/**
 * Închide modalele din slotul `@modals`, revenind la pagina de dedesubt.
 */
export const useCloseModal = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    return () => {
        closeModalRoute(router, resolveReturnTo(searchParams?.get("returnTo")));
    };
};
