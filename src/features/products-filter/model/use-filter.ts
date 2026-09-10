"use client";

import { useCallback, useMemo } from "react";

import { useUpdateSearchParams } from "@shared/lib/hooks";

import {
    FILTER_QUERY_KEYS,
    type FilterQueryKey,
    readFiltersFromSearchParams,
    serializeFilterList,
} from "./filter-params";

export function useFilter() {
    const { updateParams, searchParams } = useUpdateSearchParams();

    const filters = useMemo(
        () => readFiltersFromSearchParams(searchParams),
        [searchParams],
    );

    const toggle = useCallback(
        (key: FilterQueryKey, id: string) => {
            const current = filters[key];
            const next = current.includes(id)
                ? current.filter((value) => value !== id)
                : [...current, id];

            updateParams({
                [FILTER_QUERY_KEYS[key]]: serializeFilterList(next),
            });
        },
        [filters, updateParams],
    );

    const isChecked = useCallback(
        (key: FilterQueryKey, id: string) => filters[key].includes(id),
        [filters],
    );

    return {
        filters,
        toggle,
        isChecked,
    };
}
