import { PizzaCrust, PizzaSize } from "@prisma/client";

function pickEnumValues<T extends string>(
    values: string[] | undefined,
    allowed: readonly T[],
): T[] | undefined {
    if (!values?.length) return undefined;

    const allowedSet = new Set<string>(allowed);
    const picked = values.filter((value): value is T => allowedSet.has(value));

    return picked.length > 0 ? picked : undefined;
}

export function parseVariantFilters(
    sizes?: string[],
    crusts?: string[],
): { sizes?: PizzaSize[]; crusts?: PizzaCrust[] } {
    return {
        sizes: pickEnumValues(sizes, Object.values(PizzaSize)),
        crusts: pickEnumValues(crusts, Object.values(PizzaCrust)),
    };
}
