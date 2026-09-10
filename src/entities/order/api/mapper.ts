import type { OrderStatus, Prisma } from "@prisma/client";
import { formatPrice } from "@shared/utils";

import type { OrderListItem } from "../model/types";

export type OrderListRow = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                variant: {
                    include: {
                        product: {
                            include: {
                                translations: true;
                            };
                        };
                    };
                };
            };
        };
    };
}>;

function formatPlacedAt(date: Date, locale: string) {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function mapOrderListItem(
    order: OrderListRow,
    locale: string,
): OrderListItem {
    return {
        id: order.id,
        status: order.status as OrderStatus,
        total: formatPrice(order.total),
        address: order.address,
        placedAt: formatPlacedAt(order.createdAt, locale),
        items: order.items.map((item) => ({
            id: item.id,
            name: item.variant.product.translations[0]?.name ?? "",
            quantity: item.quantity,
            price: formatPrice(item.priceSnapshot),
        })),
    };
}
