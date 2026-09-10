"use server";

import { getCurrentUser } from "@entities/user";
import { prisma } from "@shared/lib/prisma";

import type {
    CreateOrderInput,
    CreateOrderResult,
} from "../model/types";

const MIN_ADDRESS_LENGTH = 8;
const MAX_ADDRESS_LENGTH = 200;
const MAX_LINE_QUANTITY = 20;

export async function createOrder(
    input: CreateOrderInput,
): Promise<CreateOrderResult> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: "unauthenticated" };
        }

        const address = input.address.trim();

        if (
            address.length < MIN_ADDRESS_LENGTH ||
            address.length > MAX_ADDRESS_LENGTH
        ) {
            return { success: false, error: "invalidAddress" };
        }

        const items = input.items.filter((item) => item.quantity >= 1);

        if (items.length === 0) {
            return { success: false, error: "emptyCart" };
        }

        const variantIds = [...new Set(items.map((item) => item.variantId))];
        const extraIds = [
            ...new Set(
                items.flatMap((item) => item.extraIngredientIds ?? []),
            ),
        ];

        const [variants, extras] = await Promise.all([
            prisma.productVariant.findMany({
                where: { id: { in: variantIds } },
                select: { id: true, price: true },
            }),
            extraIds.length
                ? prisma.ingredient.findMany({
                      where: { id: { in: extraIds } },
                      select: { id: true, extraPrice: true },
                  })
                : Promise.resolve([]),
        ]);

        const variantPriceById = new Map(
            variants.map((variant) => [variant.id, variant.price]),
        );
        const extraPriceById = new Map(
            extras.map((ingredient) => [ingredient.id, ingredient.extraPrice]),
        );

        const orderItems = items.map((item) => {
            const variantPrice = variantPriceById.get(item.variantId);

            if (variantPrice === undefined) {
                return null;
            }

            const extrasTotal = (item.extraIngredientIds ?? []).reduce(
                (sum, extraId) => sum + (extraPriceById.get(extraId) ?? 0),
                0,
            );
            const quantity = Math.min(item.quantity, MAX_LINE_QUANTITY);

            return {
                variantId: item.variantId,
                quantity,
                priceSnapshot: (variantPrice + extrasTotal) * quantity,
            };
        });

        if (orderItems.some((item) => item === null)) {
            return { success: false, error: "variantNotFound" };
        }

        const lines = orderItems.filter(
            (item): item is NonNullable<typeof item> => item !== null,
        );
        const total = lines.reduce((sum, item) => sum + item.priceSnapshot, 0);

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                address,
                total,
                items: {
                    create: lines,
                },
            },
            select: { id: true },
        });

        return { success: true, orderId: order.id };
    } catch {
        return { success: false, error: "unknown" };
    }
}
