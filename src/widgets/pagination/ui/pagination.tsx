"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@shared/ui";

import { usePagination } from "../lib/use-pagination";

interface PaginationProps {
    totalPages: number;
    visiblePages?: number;
}

export function Pagination({
    totalPages,
    visiblePages = 3,
}: PaginationProps) {
    const t = useTranslations("widgets.pagination");
    const { currentPage, pages, hasPrev, hasNext, goPrev, goNext, goToPage } =
        usePagination({
            totalPages,
            visiblePages,
        });

    if (totalPages <= 1) return null;

    return (
        <div className="flex max-w-full flex-wrap items-center justify-center gap-4 sm:max-w-max sm:flex-nowrap sm:gap-7.5">
            <div className="flex items-center justify-center gap-2">
                <Button
                    onlyIcon
                    kind="outline"
                    color="secondary"
                    disabled={!hasPrev}
                    onClick={goPrev}
                    aria-label={t("prev")}
                >
                    <ArrowLeft />
                </Button>

                <div className="flex items-center gap-2">
                    {pages.map((page) => {
                        const isActive = page === currentPage;

                        return (
                            <Button
                                key={page}
                                onlyIcon
                                kind={isActive ? "solid" : "outline"}
                                color={isActive ? "primary" : "secondary"}
                                onClick={() => goToPage(page)}
                                aria-label={t("page", { page })}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    onlyIcon
                    kind="outline"
                    color="secondary"
                    disabled={!hasNext}
                    onClick={goNext}
                    aria-label={t("next")}
                >
                    <ArrowRight />
                </Button>
            </div>

            <div className="flex items-center gap-2 font-semibold text-[#888888]">
                <span>{currentPage}</span>
                <span>{t("of")}</span>
                <span>{totalPages}</span>
            </div>
        </div>
    );
}
