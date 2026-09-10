"use server";

import { UserLanguage } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { prisma } from "@shared/lib/prisma";

import { mapProductDetail } from "./mapper";
import type { ProductDetailModel } from "../model/types";

export interface GetProductProps {
    id: string;
}

export async function getProduct({
    id,
}: GetProductProps): Promise<ProductDetailModel | null> {
    const locale = await getLocale();
    const dbLocale = locale.toUpperCase() as UserLanguage;
    const t = await getTranslations("shared.enums");

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            translations: {
                where: { locale: dbLocale },
                take: 1,
            },
            variants: {
                orderBy: [{ size: "asc" }, { crust: "asc" }],
            },
            ingredients: {
                where: {
                    isOptional: true,
                    extraPrice: { gt: 0 },
                },
                orderBy: { createdAt: "asc" },
                include: {
                    translations: {
                        where: { locale: dbLocale },
                        take: 1,
                    },
                },
            },
        },
    });

    if (!product) {
        return null;
    }

    return mapProductDetail(product, (key) => t(key));
}
