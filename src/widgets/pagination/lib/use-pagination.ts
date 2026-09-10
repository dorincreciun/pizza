"use client";

import { useCallback, useMemo } from "react";

import { useUpdateSearchParams } from "@shared/lib/hooks";

import { getVisibleWindow } from "./get-visible-window";
import { parsePageParam } from "./parse-page-param";

interface UsePaginationOptions {
    totalPages: number;
    visiblePages?: number;
    pageParam?: string;
}

interface UsePaginationResult {
    currentPage: number;
    pages: number[];
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    goToPage: (page: number) => void;
    goPrev: () => void;
    goNext: () => void;
}

export function usePagination({
    totalPages,
    visiblePages = 4,
    pageParam = "page",
}: UsePaginationOptions): UsePaginationResult {
    const { updateParams, searchParams } = useUpdateSearchParams();

    const currentPage = useMemo(
        () => parsePageParam(searchParams?.get(pageParam), totalPages),
        [searchParams, pageParam, totalPages],
    );

    const { pages } = useMemo(
        () => getVisibleWindow(currentPage, totalPages, visiblePages),
        [currentPage, totalPages, visiblePages],
    );

    const goToPage = useCallback(
        (page: number) => {
            if (page < 1 || page > totalPages) return;

            updateParams(
                { [pageParam]: page === 1 ? null : page },
                { resetPage: false },
            );
        },
        [pageParam, totalPages, updateParams],
    );

    const goPrev = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const goNext = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    return {
        currentPage,
        pages,
        totalPages,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
        goToPage,
        goPrev,
        goNext,
    };
}
