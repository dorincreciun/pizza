"use client";

import { useTranslations } from "next-intl";

import type { ProductFilterOptions } from "@entities/product";
import { Title } from "@shared/ui";

import { FILTER_QUERY_KEYS, type FilterQueryKey } from "../model/filter-params";
import { useFilter } from "../model/use-filter";
import { FilterGroup } from "./filter-group";

interface ProductFilterPanelProps {
    options: ProductFilterOptions;
    showTitle?: boolean;
}

const FILTER_GROUPS: {
    queryKey: FilterQueryKey;
    nameKey: "crusts" | "sizes" | "ingredients";
    itemsKey: keyof ProductFilterOptions;
}[] = [
    {
        queryKey: FILTER_QUERY_KEYS.crusts,
        nameKey: "crusts",
        itemsKey: "crusts",
    },
    { queryKey: FILTER_QUERY_KEYS.sizes, nameKey: "sizes", itemsKey: "sizes" },
    {
        queryKey: FILTER_QUERY_KEYS.ingredients,
        nameKey: "ingredients",
        itemsKey: "ingredients",
    },
];

export function ProductFilterPanel({
    options,
    showTitle = true,
}: ProductFilterPanelProps) {
    const t = useTranslations("features.productsFilter");
    const { toggle, isChecked } = useFilter();

    return (
        <div className="flex w-full flex-col self-stretch md:max-w-max md:pe-4 lg:pe-2.5">
            {showTitle && (
                <Title as="h2" size="sm" className="mb-6">
                    {t("title")}
                </Title>
            )}
            <div className="flex flex-col gap-7 overflow-y-auto">
                {FILTER_GROUPS.map(({ queryKey, nameKey, itemsKey }) => (
                    <FilterGroup
                        key={queryKey}
                        name={t(`groups.${nameKey}`)}
                        items={options[itemsKey]}
                        isChecked={(id) => isChecked(queryKey, id)}
                        onToggle={(id) => toggle(queryKey, id)}
                    />
                ))}
            </div>
        </div>
    );
}
