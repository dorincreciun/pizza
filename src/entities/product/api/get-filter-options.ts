"use server";

import { PizzaCrust, PizzaSize, UserLanguage } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { prisma } from "@shared/lib/prisma";

import type { FilterOption, ProductFilterOptions } from "../model/types";

function mapEnumOptions<T extends string>(
    values: T[],
    label: (value: T) => string,
): FilterOption[] {
    return values.map((value) => ({
        id: value,
        name: label(value),
    }));
}

export async function getFilterOptions(): Promise<ProductFilterOptions> {
    const locale = await getLocale();
    const dbLocale = locale.toUpperCase() as UserLanguage;
    const t = await getTranslations("shared.enums");

    const sizes = mapEnumOptions(Object.values(PizzaSize), (size) =>
        t(`PizzaSize.${size}`),
    );

    const crusts = mapEnumOptions(Object.values(PizzaCrust), (crust) =>
        t(`PizzaCrust.${crust}`),
    );

    const ingredientsRaw = await prisma.ingredient.findMany({
        select: {
            id: true,
            translations: {
                where: { locale: dbLocale },
                select: { name: true },
                take: 1,
            },
        },
        orderBy: { createdAt: "asc" },
    });

    const ingredients: FilterOption[] = ingredientsRaw.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.translations[0]?.name ?? "",
    }));

    return {
        ingredients,
        sizes,
        crusts,
    };
}
