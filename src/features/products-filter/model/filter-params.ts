export const FILTER_QUERY_KEYS = {
    sizes: "sizes",
    crusts: "crusts",
    ingredients: "ingredients",
} as const;

export type FilterQueryKey = keyof typeof FILTER_QUERY_KEYS;

export type FilterState = Record<FilterQueryKey, string[]>;

const EMPTY_FILTERS: FilterState = {
    sizes: [],
    crusts: [],
    ingredients: [],
};

export function parseFilterList(value: string | null | undefined): string[] {
    if (!value) return [];
    return value.split(",").filter(Boolean);
}

export function serializeFilterList(values: string[]): string | null {
    return values.length > 0 ? values.join(",") : null;
}

export function readFiltersFromSearchParams(
    searchParams: URLSearchParams | null,
): FilterState {
    return {
        sizes: parseFilterList(searchParams?.get(FILTER_QUERY_KEYS.sizes)),
        crusts: parseFilterList(searchParams?.get(FILTER_QUERY_KEYS.crusts)),
        ingredients: parseFilterList(
            searchParams?.get(FILTER_QUERY_KEYS.ingredients),
        ),
    };
}

export function readFiltersFromQuery(query: {
    sizes?: string;
    crusts?: string;
    ingredients?: string;
}): FilterState {
    return {
        sizes: parseFilterList(query.sizes),
        crusts: parseFilterList(query.crusts),
        ingredients: parseFilterList(query.ingredients),
    };
}

export function emptyFilters(): FilterState {
    return { ...EMPTY_FILTERS };
}

export function hasActiveFilters(state: FilterState): boolean {
    return (
        state.sizes.length > 0 ||
        state.crusts.length > 0 ||
        state.ingredients.length > 0
    );
}
