"use server";

import { UserLanguage } from "@prisma/client";
import { getLocale } from "next-intl/server";

import { prisma } from "@shared/lib/prisma";

import { mapCategory } from "./mapper";
import type { CategoryModel, CategoryRow } from "../model/types";

export async function getCategoryList(): Promise<CategoryModel[]> {
    const locale = await getLocale();
    const dbLocale = locale.toUpperCase() as UserLanguage;

    const categories: CategoryRow[] = await prisma.category.findMany({
        select: {
            id: true,
            translations: {
                where: { locale: dbLocale },
                select: { name: true },
            },
        },
    });

    return categories.map(mapCategory);
}
