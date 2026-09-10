import { ALL_CATEGORY_ID } from "../model/constants";

/**
 * Normalizeaza valoarea din URL la un ID real de categorie sau `undefined`
 * (cand este sentinelul „toate”). Apelat la granita route → entitate.
 */
export function normalizeCategoryId(value: string | undefined): string | undefined {
    if (!value || value === ALL_CATEGORY_ID) return undefined;
    return value;
}
