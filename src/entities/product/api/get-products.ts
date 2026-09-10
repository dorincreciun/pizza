"use server";

import { PizzaCrust, PizzaSize, UserLanguage, VariantType } from "@prisma/client";
import { getLocale } from "next-intl/server";

import { prisma } from "@shared/lib/prisma";

import { parseVariantFilters } from "../lib/parse-variant-filters";
import { mapProductListItem } from "./mapper";
import type { ProductsPageResult } from "../model/types";

export interface GetProductsProps {
    categoryId?: string;
    page?: number;
    limit?: number;
    sizes?: string[];
    crusts?: string[];
    ingredients?: string[];
}

export async function getProducts({
    categoryId,
    page = 1,
    limit = 10,
    sizes,
    crusts,
    ingredients,
}: GetProductsProps = {}): Promise<ProductsPageResult> {
    const locale = await getLocale();
    const dbLocale = locale.toUpperCase() as UserLanguage;

    const { sizes: sizeFilter, crusts: crustFilter } = parseVariantFilters(
        sizes,
        crusts,
    );

    const variantConditions: {
        size?: { in: PizzaSize[] };
        crust?: { in: PizzaCrust[] };
    }[] = [];

    if (sizeFilter?.length) {
        variantConditions.push({ size: { in: sizeFilter } });
    }

    if (crustFilter?.length) {
        variantConditions.push({ crust: { in: crustFilter } });
    }

    const whereClause = {
        ...(categoryId && { categoryId }),
        ...(ingredients?.length && {
            ingredients: { some: { id: { in: ingredients } } },
        }),
        ...(variantConditions.length > 0 && {
            variants: {
                some: {
                    variantType: VariantType.PIZZA,
                    AND: variantConditions,
                },
            },
        }),
    };

    const [productsRaw, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                imageUrl: true,
                basePrice: true,
                variants: {
                    orderBy: { price: "asc" },
                    take: 1,
                    select: {
                        id: true,
                        price: true,
                    },
                },
                translations: {
                    where: { locale: dbLocale },
                    select: {
                        name: true,
                        shortDescription: true,
                    },
                    take: 1,
                },
            },
        }),
        prisma.product.count({ where: whereClause }),
    ]);

    const products = productsRaw.map(mapProductListItem);
    const totalPages = Math.ceil(totalCount / limit);

    return {
        products,
        meta: {
            total: totalCount,
            currentPage: page,
            limit,
            totalPages,
        },
    };
}
