"use server";

import { UserLanguage } from "@prisma/client";
import { getLocale } from "next-intl/server";

import { getCurrentUser } from "@entities/user";
import { prisma } from "@shared/lib/prisma";

import { mapOrderListItem } from "./mapper";
import type { OrderListItem } from "../model/types";

export async function getOrders(): Promise<OrderListItem[]> {
    const user = await getCurrentUser();

    if (!user) {
        return [];
    }

    const locale = await getLocale();
    const dbLocale = locale.toUpperCase() as UserLanguage;

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    translations: {
                                        where: { locale: dbLocale },
                                        take: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return orders.map((order) => mapOrderListItem(order, locale));
}
