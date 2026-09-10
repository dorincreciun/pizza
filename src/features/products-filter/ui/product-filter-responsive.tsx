"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ProductFilterOptions } from "@entities/product";
import { Button, Sidebar, SidebarProvider, Title } from "@shared/ui";

import { useStoreProductsFilter } from "../model/store";
import { ProductFilterPanel } from "./product-filter-panel";

interface ProductFilterResponsiveProps {
    options: ProductFilterOptions;
}

const MobileFilterTrigger = () => {
    const setOpen = useStoreProductsFilter((s) => s.setOpen);
    const t = useTranslations("features.productsFilter");

    return (
        <Button
            type="button"
            kind="outline"
            color="secondary"
            className="w-full md:hidden"
            onClick={() => setOpen(true)}
        >
            <SlidersHorizontal aria-hidden />
            {t("openMobile")}
        </Button>
    );
};

export function ProductFilterResponsive({ options }: ProductFilterResponsiveProps) {
    const t = useTranslations("features.productsFilter");
    const open = useStoreProductsFilter((s) => s.open);
    const setOpen = useStoreProductsFilter((s) => s.setOpen);

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <MobileFilterTrigger />

            <Sidebar side="left" className="md:hidden max-w-85">
                <Sidebar.Header>
                    <Title as="h2" size="sm">
                        {t("title")}
                    </Title>
                </Sidebar.Header>

                <Sidebar.Close aria-label={t("closeSidebar")} />

                <Sidebar.Body>
                    <ProductFilterPanel options={options} showTitle={false} />
                </Sidebar.Body>
            </Sidebar>

            <div className="hidden md:block">
                <ProductFilterPanel options={options} />
            </div>
        </SidebarProvider>
    );
}
