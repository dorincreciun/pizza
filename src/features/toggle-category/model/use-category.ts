"use client";

import { useUpdateSearchParams } from "@shared/lib/hooks";

import { ALL_CATEGORY_ID } from "./constants";

export function useCategory() {
    const { updateParams, searchParams } = useUpdateSearchParams();

    const activeCategoryId =
        searchParams?.get("categoryId") ?? ALL_CATEGORY_ID;

    const change = (categoryId: string) => {
        updateParams({
            categoryId:
                categoryId === ALL_CATEGORY_ID ? null : categoryId,
        });
    };

    return { change, activeCategoryId };
}
