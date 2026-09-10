import type { OrderStatus } from "@prisma/client";

export type CreateOrderErrorCode =
    | "unauthenticated"
    | "emptyCart"
    | "invalidAddress"
    | "variantNotFound"
    | "unknown";

export type CreateOrderItemInput = {
    variantId: string;
    quantity: number;
    extraIngredientIds?: string[];
};

export type CreateOrderInput = {
    address: string;
    items: CreateOrderItemInput[];
};

export type CreateOrderResult =
    | { success: true; orderId: string }
    | { success: false; error: CreateOrderErrorCode };

export type OrderListItemLine = {
    id: string;
    name: string;
    quantity: number;
    price: string;
};

export type OrderListItem = {
    id: string;
    status: OrderStatus;
    total: string;
    address: string;
    placedAt: string;
    items: OrderListItemLine[];
};
