"use client";

import { useTranslations } from "next-intl";

import { selectIsCartEmpty, useStoreCart } from "@entities/cart";
import { Sidebar, SidebarProvider } from "@shared/ui";

import { CartContent } from "./cart-content";
import { CartHeader } from "./cart-header";
import { CartSummary } from "./cart-summary";

export const Cart = () => {
    const t = useTranslations("widgets.cart");
    const open = useStoreCart((state) => state.open);
    const setOpen = useStoreCart((state) => state.setOpen);
    const isEmpty = useStoreCart(selectIsCartEmpty);

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <Sidebar side="right">
                <Sidebar.Header>
                    <CartHeader />
                </Sidebar.Header>
                <Sidebar.Close aria-label={t("closeSidebar")} />
                <Sidebar.Body>
                    <CartContent />
                </Sidebar.Body>
                {!isEmpty && (
                    <Sidebar.Footer>
                        <CartSummary />
                    </Sidebar.Footer>
                )}
            </Sidebar>
        </SidebarProvider>
    );
};
