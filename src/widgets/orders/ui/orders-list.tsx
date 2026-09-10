import { getTranslations } from "next-intl/server";

import type { OrderListItem } from "@entities/order";

interface OrdersListProps {
    orders: OrderListItem[];
}

export async function OrdersList({ orders }: OrdersListProps) {
    const t = await getTranslations("pages.OrdersPage");
    const tEnums = await getTranslations("shared.enums");

    return (
        <ul className="flex flex-col gap-4">
            {orders.map((order) => (
                <li
                    key={order.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {t("placedAt", { date: order.placedAt })}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {t("addressLabel")}: {order.address}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-[#FE5F00]">
                                {tEnums(`OrderStatus.${order.status}`)}
                            </p>
                            <p className="mt-1 text-base font-bold text-gray-900">
                                {order.total}
                            </p>
                        </div>
                    </div>
                    <ul className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                        {order.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between gap-4 text-sm"
                            >
                                <span className="text-gray-700">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium text-gray-900">
                                    {item.price}
                                </span>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}
